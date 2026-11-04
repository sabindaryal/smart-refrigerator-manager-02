# 4. System Design

## 4.1 Proposed Architecture

The project will retain its existing Spring Boot client-server architecture and extend it with three major enhancements:

1. Multilingual localization.
2. Food waste tracking and analytics.
3. AI-powered recipe recommendations.

## 4.2 Multilingual Localization Design

The localization feature will use Spring Boot's built-in internationalization support.

The proposed components are:

- `CookieLocaleResolver`: Stores the selected language in a browser cookie.
- `LocaleChangeInterceptor`: Handles language changes through a request parameter.
- `MessageSource`: Loads translated messages from language-specific properties files.
- Thymeleaf message expressions: Display translated server-rendered content.
- JavaScript localization: Displays translated dynamic content and user notifications.

Three language bundles will be provided:

- `messages.properties` — English.
- `messages_ja.properties` — Japanese.
- `messages_ne.properties` — Nepali.

The supported locale codes will be `en`, `ja` and `ne`.

## 4.3 Language Preference Persistence

The selected language will be stored using a browser cookie rather than adding a language field to the existing User database entity.

This avoids unnecessary database schema changes and allows the selected language to persist across browser restarts.

The preference will be specific to the browser being used.

## 4.4 Existing System Compatibility

The implementation will preserve:

- Existing user registration and authentication.
- Existing food inventory records.
- Existing database category values.
- Existing user-specific data access.
- Existing food status codes used by application logic.

Only presentation text will be translated. Database values and internal application status codes will remain language-independent.