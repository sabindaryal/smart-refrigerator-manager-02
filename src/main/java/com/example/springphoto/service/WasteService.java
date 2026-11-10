package com.example.springphoto.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.springphoto.model.Food;
import com.example.springphoto.model.User;
import com.example.springphoto.model.WasteEvent;
import com.example.springphoto.repository.FoodRepository;
import com.example.springphoto.repository.WasteEventRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WasteService {
    private final FoodRepository foods;
    private final WasteEventRepository events;

    public List<WasteEvent> history(User user) { return events.findByUserOrderByRecordedAtDesc(user); }

    @Transactional
    public WasteEvent recordWaste(Long foodId, Integer quantity, String reason, User user) {
        Food food = foods.findById(foodId).orElseThrow(() -> new IllegalArgumentException("Food not found"));
        if (food.getUser() == null || !food.getUser().getId().equals(user.getId()))
            throw new SecurityException("Food does not belong to this account");
        int wasted = quantity == null ? food.getQuantity() : quantity;
        if (wasted < 1 || wasted > food.getQuantity()) throw new IllegalArgumentException("Waste quantity must be between 1 and current stock");
        WasteEvent event = new WasteEvent();
        event.setFoodName(food.getName()); event.setCategory(food.getCategory()); event.setQuantity(wasted);
        event.setReason(reason == null || reason.isBlank() ? "Other" : reason.trim()); event.setUser(user);
        if (wasted == food.getQuantity()) foods.delete(food);
        else { food.setQuantity(food.getQuantity() - wasted); foods.save(food); }
        return events.save(event);
    }
}
