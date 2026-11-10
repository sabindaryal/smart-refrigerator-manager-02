package com.example.springphoto.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.springphoto.model.User;
import com.example.springphoto.model.WasteEvent;

public interface WasteEventRepository extends JpaRepository<WasteEvent, Long> {
    List<WasteEvent> findByUserOrderByRecordedAtDesc(User user);
}
