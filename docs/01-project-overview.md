# 1. Project Overview

## 1.1 Project Title

Smart Refrigerator Manager – Software Enhancement Project

## 1.2 Introduction

The Smart Refrigerator Manager is a web-based application designed to help users manage food items stored in their refrigerators. It allows registered users to maintain an inventory of food items, monitor expiry dates, track quantities and identify items that need restocking.

The existing application provides basic inventory management functionality through a web interface developed using Java, Spring Boot, Thymeleaf, HTML, CSS and JavaScript.

This project focuses on analysing and enhancing the existing open-source application by introducing three additional features: multilingual localisation, food waste tracking and analytics, and AI-powered recipe recommendations.

## 1.3 Project Aim

The aim is to enhance the existing Smart Refrigerator Manager by improving accessibility, reducing food waste and providing intelligent recipe recommendations based on users' existing food inventories.

## 1.4 Project Objectives

1. Introduce English, Japanese and Nepali language support.
2. Allow users to record discarded food and monitor food waste.
3. Provide food waste history and summary information.
4. Integrate an AI-powered recipe recommendation feature.
5. Prioritise ingredients approaching their expiry dates when generating recipes.
6. Maintain secure, user-specific inventory and waste records.
7. Test the enhancements to ensure functionality, reliability and usability.

## 1.5 Planned Enhancements

### Enhancement 1: Multilingual Localisation

Provide an interface available in English, Japanese and Nepali. Users should be able to change their preferred language and retain their selection.

### Enhancement 2: Food Waste Tracking and Analytics

Allow users to record discarded food, view waste history and analyse food waste through summaries based on relevant periods and categories.

### Enhancement 3: AI-Powered Recipe Recommendation

Use AI to analyse the authenticated user's refrigerator inventory and recommend recipes based on available ingredients. Ingredients approaching expiry should receive priority, while expired ingredients should be excluded.

## 1.6 Technology Stack

| Technology | Purpose |
|---|---|
| Java | Backend programming |
| Spring Boot | Application framework |
| Spring Security | Authentication and access control |
| Spring Data JPA | Database operations |
| MySQL | Local development database |
| Thymeleaf | Server-side HTML rendering |
| HTML and CSS | User interface |
| JavaScript | Client-side functionality |
| Maven | Dependency and build management |
| Git and GitHub | Version control |
| ScrumDesk | Agile project management |

## 1.7 Project Scope

The project will extend the existing application rather than replace it. Existing authentication and inventory management functionality will be retained while the three planned enhancements are introduced.

The implementation will focus on the agreed requirements and will be evaluated through functional testing, integration testing and user-interface verification.