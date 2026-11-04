
package com.example.springphoto.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import com.example.springphoto.model.Food;
import com.example.springphoto.model.User;
import com.example.springphoto.repository.FoodRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FoodService {

	private final FoodRepository foodRepository;
	private final MessageSource messageSource;

	private String message(String key) {
		Locale locale = LocaleContextHolder.getLocale();
		return messageSource.getMessage(key, null, locale);
	}

	public List<Food> getAllFoods(User user) {
		return foodRepository.findByUserOrderByIdAsc(user);
	}

	public void saveFood(Food food, User user) {
		food.setUser(user);

		if (food.getQuantity() == null || food.getQuantity() < 1) {
			throw new IllegalArgumentException(
					message("error.quantityMustBeAtLeastOne"));
		}

		if (food.getNeedsRestock() == null) {
			food.setNeedsRestock(false);
		}

		foodRepository.save(food);
	}

	public Food updateFoodStatus(
			Long id,
			Integer quantity,
			Boolean needsRestock,
			LocalDate expiryDate,
			User user) {

		Food food = foodRepository.findById(id)
				.orElseThrow(() -> new RuntimeException(
						message("error.foodNotFound")));

		if (food.getUser() == null || user == null
				|| food.getUser().getId().longValue()
				!= user.getId().longValue()) {
			throw new RuntimeException(message("error.forbidden"));
		}

		if (quantity != null) {
			if (quantity < 0) {
				throw new IllegalArgumentException(
						message("validation.quantityMin"));
			}
			food.setQuantity(quantity);
		}

		if (needsRestock != null) {
			food.setNeedsRestock(needsRestock);
		}

		if (expiryDate != null) {
			food.setExpiryDate(expiryDate);
		}

		return foodRepository.save(food);
	}

	public void deleteFood(Long id, User user) {
		Food food = foodRepository.findById(id)
				.orElseThrow(() -> new RuntimeException(
						message("error.foodNotFound")));

		if (food.getUser() == null || user == null
				|| food.getUser().getId().longValue()
				!= user.getId().longValue()) {
			throw new RuntimeException(message("error.forbidden"));
		}

		foodRepository.deleteById(id);
	}
}
