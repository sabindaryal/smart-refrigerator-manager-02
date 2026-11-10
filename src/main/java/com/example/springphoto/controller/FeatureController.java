package com.example.springphoto.controller;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.example.springphoto.model.User;
import com.example.springphoto.security.CustomUserDetails;
import com.example.springphoto.service.MenuSuggestionService;
import com.example.springphoto.service.UserService;
import com.example.springphoto.service.WasteService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FeatureController {
    private final WasteService wasteService;
    private final MenuSuggestionService menuService;
    private final UserService userService;

    private User current(CustomUserDetails principal) {
        if (principal == null || principal.getUser() == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return principal.getUser();
    }
    @GetMapping("/waste") public Object history(@AuthenticationPrincipal CustomUserDetails principal) { return wasteService.history(current(principal)); }
    @PostMapping("/foods/{id}/waste") public Object waste(@PathVariable Long id, @RequestBody(required=false) WasteRequest request, @AuthenticationPrincipal CustomUserDetails principal) {
        try { return wasteService.recordWaste(id, request == null ? null : request.quantity(), request == null ? null : request.reason(), current(principal)); }
        catch (SecurityException e) { throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage()); }
        catch (IllegalArgumentException e) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage()); }
    }
    @GetMapping("/menu-suggestions") public Object suggestions(@AuthenticationPrincipal CustomUserDetails principal) { return menuService.suggest(current(principal)); }
    @GetMapping("/profile") public Object profile(@AuthenticationPrincipal CustomUserDetails principal) {
        User u = current(principal); Map<String,Object> result = new LinkedHashMap<>(); result.put("username", u.getUsername()); result.put("email", u.getEmail());
        result.put("displayName", u.getDisplayName()); result.put("preferredLanguage", u.getPreferredLanguage()); return result;
    }
    @PatchMapping("/profile") public Object updateProfile(@RequestBody ProfileRequest request, @AuthenticationPrincipal CustomUserDetails principal) {
        try { User u = userService.updateProfile(current(principal), request.displayName(), request.preferredLanguage()); return profileFrom(u); }
        catch (IllegalArgumentException e) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage()); }
    }
    private Object profileFrom(User u) { Map<String,Object> result=new LinkedHashMap<>(); result.put("username",u.getUsername());result.put("email",u.getEmail());result.put("displayName",u.getDisplayName());result.put("preferredLanguage",u.getPreferredLanguage());return result; }
    public record WasteRequest(Integer quantity, String reason) {}
    public record ProfileRequest(String displayName, String preferredLanguage) {}
}
