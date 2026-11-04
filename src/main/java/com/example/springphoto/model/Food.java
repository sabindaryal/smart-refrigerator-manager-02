
package com.example.springphoto.model;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Entity
@Table(name = "foods")
@Data
public class Food {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "{validation.foodNameRequired}")
	@Size(max = 50, message = "{validation.foodNameMax}")
	private String name;

	@NotNull(message = "{validation.expiryRequired}")
	private LocalDate expiryDate;

	private String category;

	@NotNull(message = "{validation.quantityRequired}")
	@Min(value = 0, message = "{validation.quantityMin}")
	private Integer quantity;

	private Boolean needsRestock = false;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id")
	@JsonIgnore
	private User user;

	private Long getDaysUntilExpiry() {
		if (this.expiryDate == null) {
			return null;
		}

		return ChronoUnit.DAYS.between(
				LocalDate.now(),
				this.expiryDate
		);
	}

	public String getStatus() {
		Long diffDays = getDaysUntilExpiry();

		if (diffDays == null) {
			return "safe";
		}

		if (diffDays <= 0) {
			return "danger";
		}

		if (diffDays <= 3) {
			return "warning";
		}

		return "safe";
	}
}
