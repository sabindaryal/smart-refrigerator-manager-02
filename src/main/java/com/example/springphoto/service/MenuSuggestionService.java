package com.example.springphoto.service;

import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.springphoto.model.Food;
import com.example.springphoto.model.User;
import com.example.springphoto.repository.FoodRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MenuSuggestionService {
    private static final Logger log = LoggerFactory.getLogger(MenuSuggestionService.class);
    private final FoodRepository foodRepository;
    private final RestClient.Builder restClientBuilder;
    private final ObjectMapper objectMapper;
    @Value("${AI_API_KEY:}") private String apiKey;
    @Value("${AI_API_URL:https://api.openai.com/v1/chat/completions}") private String apiUrl;
    @Value("${AI_MODEL:gpt-4o-mini}") private String model;
    private record Recipe(String name, String description, List<String> ingredients, int minutes) {}
    private static final List<Recipe> RECIPES = List.of(
        new Recipe("Vegetable fried rice", "A quick way to use vegetables and cooked rice.", List.of("rice", "egg", "carrot", "onion", "peas"), 20),
        new Recipe("Creamy tomato pasta", "Pasta with a simple tomato and dairy sauce.", List.of("pasta", "tomato", "milk", "cheese", "onion"), 25),
        new Recipe("Chicken and vegetable stir-fry", "A flexible stir-fry using fresh produce.", List.of("chicken", "broccoli", "carrot", "onion", "soy sauce"), 25),
        new Recipe("Omelette", "A fast meal that works with leftover vegetables.", List.of("egg", "milk", "cheese", "spinach", "tomato"), 15),
        new Recipe("Fruit and yoghurt bowl", "A no-cook option for ripe fruit.", List.of("apple", "banana", "berries", "yoghurt"), 5),
        new Recipe("Tuna rice bowl", "A simple pantry meal with fresh toppings.", List.of("rice", "tuna", "cucumber", "carrot", "egg"), 15));

    public List<Map<String, Object>> suggest(User user) {
        List<Food> stock = foodRepository.findByUserOrderByIdAsc(user).stream().filter(f -> f.getQuantity() != null && f.getQuantity() > 0).toList();
        if (!apiKey.isBlank()) {
            try { return askAi(stock, user); }
            catch (Exception e) { log.warn("AI menu provider unavailable; using local ingredient matching", e); }
        }
        return localSuggestions(stock);
    }
    private List<Map<String,Object>> askAi(List<Food> stock, User user) throws Exception {
        List<Map<String,Object>> inventory = stock.stream().map(f -> Map.<String,Object>of("name", f.getName(), "quantity", f.getQuantity(), "category", Objects.toString(f.getCategory(), ""), "expiryDate", Objects.toString(f.getExpiryDate(), ""))).toList();
        String language = "ja".equalsIgnoreCase(user.getPreferredLanguage()) ? "Japanese" : "English";
        String instruction = "Suggest up to 5 practical meals using the supplied inventory. Write all meal names and descriptions in " + language + ". Prioritise items with the nearest expiry when dates are provided; do not assume unlisted ingredients except basic water, salt and oil. Reply ONLY as JSON array. Each item must have name, description, matchingIngredients (array of exact inventory names as supplied), matchPercent (0-100), minutes (integer). Inventory: " + objectMapper.writeValueAsString(inventory);
        Map<String,Object> request = Map.of("model", model, "messages", List.of(Map.of("role", "user", "content", instruction)), "temperature", 0.3);
        Map<?,?> response = restClientBuilder.build().post().uri(apiUrl).header("Authorization", "Bearer " + apiKey).body(request).retrieve().body(Map.class);
        List<?> choices = (List<?>) response.get("choices"); Map<?,?> choice = (Map<?,?>) choices.get(0); Map<?,?> message = (Map<?,?>) choice.get("message");
        String content = ((String)message.get("content")).trim().replaceAll("^```(?:json)?\\s*|\\s*```$", "");
        List<Map<String,Object>> suggestions = objectMapper.readValue(content, new TypeReference<>() {});
        return suggestions.stream().limit(5).toList();
    }
    private List<Map<String, Object>> localSuggestions(List<Food> stock) {
        return RECIPES.stream().map(recipe -> {
            List<String> matched = stock.stream().filter(f -> recipe.ingredients().stream().anyMatch(i -> ingredientMatches(f.getName(), i)))
                    .map(Food::getName).distinct().toList();
            int score = recipe.ingredients().isEmpty() ? 0 : (int)Math.round(100.0 * matched.size() / recipe.ingredients().size());
            Map<String,Object> row = new LinkedHashMap<>(); row.put("name", recipe.name()); row.put("description", recipe.description());
            row.put("matchingIngredients", matched); row.put("matchPercent", score); row.put("minutes", recipe.minutes()); return row;
        }).filter(r -> !((List<?>)r.get("matchingIngredients")).isEmpty())
          .sorted(Comparator.comparingInt((Map<String,Object> r) -> (Integer)r.get("matchPercent")).reversed()).limit(5).collect(Collectors.toList());
    }
    private boolean matches(String a, String b) { return a != null && b != null && (a.toLowerCase(Locale.ROOT).contains(b.toLowerCase(Locale.ROOT)) || b.toLowerCase(Locale.ROOT).contains(a.toLowerCase(Locale.ROOT))); }
    private boolean ingredientMatches(String foodName, String ingredient) {
        if (matches(foodName, ingredient)) return true;
        Map<String, List<String>> aliases = Map.ofEntries(
            Map.entry("egg", List.of("卵", "たまご")), Map.entry("rice", List.of("米", "ご飯", "ごはん")), Map.entry("carrot", List.of("にんじん", "人参")),
            Map.entry("onion", List.of("玉ねぎ", "たまねぎ")), Map.entry("tomato", List.of("トマト")), Map.entry("milk", List.of("牛乳")), Map.entry("cheese", List.of("チーズ")),
            Map.entry("chicken", List.of("鶏肉", "とり肉")), Map.entry("broccoli", List.of("ブロッコリー")), Map.entry("pasta", List.of("パスタ")), Map.entry("spinach", List.of("ほうれん草", "ほうれんそう")),
            Map.entry("apple", List.of("りんご", "リンゴ")), Map.entry("banana", List.of("バナナ")), Map.entry("yoghurt", List.of("ヨーグルト")), Map.entry("cucumber", List.of("きゅうり", "キュウリ")),
            Map.entry("tuna", List.of("ツナ", "まぐろ", "マグロ")), Map.entry("soy sauce", List.of("醤油", "しょうゆ")), Map.entry("peas", List.of("えんどう", "グリーンピース")), Map.entry("berries", List.of("ベリー", "いちご", "苺")));
        return aliases.getOrDefault(ingredient, List.of()).stream().anyMatch(alias -> matches(foodName, alias));
    }
}
