package com.example.springphoto.config;

import java.time.LocalDate;
import java.util.List;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.springphoto.model.Food;
import com.example.springphoto.model.User;
import com.example.springphoto.repository.FoodRepository;
import com.example.springphoto.repository.UserRepository;

@Configuration
@Profile("local")
public class DemoDataInitializer {
    @Bean
    ApplicationRunner seedDemoInventory(UserRepository users, FoodRepository foods, PasswordEncoder passwordEncoder) {
        return args -> {
            if (users.findByUsername("demo").isPresent()) return;
            User demo = new User();
            demo.setUsername("demo");
            demo.setEmail("demo@example.com");
            demo.setDisplayName("Demo User");
            demo.setPreferredLanguage("en");
            demo.setPassword(passwordEncoder.encode("Demo12345!"));
            demo.setEnabled(true);
            users.save(demo);

            LocalDate today = LocalDate.now();
            List<Food> samples = List.of(
                food("Milk", "乳製品", 1, today.plusDays(1), false, demo),
                food("Eggs", "肉・魚", 6, today.plusDays(8), false, demo),
                food("Carrots", "野菜", 4, today.plusDays(2), false, demo),
                food("Onions", "野菜", 3, today.plusDays(18), false, demo),
                food("Tomatoes", "野菜", 3, today.plusDays(3), false, demo),
                food("Spinach", "野菜", 1, today.plusDays(1), true, demo),
                food("Broccoli", "野菜", 2, today.plusDays(4), false, demo),
                food("Rice", "パン・ご飯", 1, today.plusDays(180), false, demo),
                food("Pasta", "パン・ご飯", 2, today.plusDays(240), false, demo),
                food("Chicken breast", "肉・魚", 2, today.plusDays(2), false, demo),
                food("Cheese", "乳製品", 1, today.plusDays(10), false, demo),
                food("Yoghurt", "乳製品", 2, today.plusDays(5), false, demo),
                food("Apples", "果物", 5, today.plusDays(14), false, demo),
                food("Bananas", "果物", 3, today.plusDays(2), true, demo),
                food("Cucumber", "野菜", 1, today.plusDays(4), false, demo),
                food("Tuna", "肉・魚", 2, today.plusDays(365), false, demo),
                food("Soy sauce", "調味料", 1, today.plusDays(365), false, demo),
                food("Green peas", "野菜", 1, today.plusDays(120), false, demo),
                food("Bread", "パン・ご飯", 1, today.plusDays(3), true, demo),
                food("Strawberries", "果物", 1, today.plusDays(1), false, demo));
            foods.saveAll(samples);
        };
    }

    private Food food(String name, String category, int quantity, LocalDate expiry, boolean restock, User owner) {
        Food food = new Food();
        food.setName(name);
        food.setCategory(category);
        food.setQuantity(quantity);
        food.setExpiryDate(expiry);
        food.setNeedsRestock(restock);
        food.setUser(owner);
        return food;
    }
}
