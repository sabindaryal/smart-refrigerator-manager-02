# 2. Existing System Analysis

## 2.1 Overview of the Existing System

The Smart Refrigerator Manager is an existing web-based application designed to help users manage food stored in their refrigerators. Users can register, log in, add food items, record expiry dates and quantities, monitor food status, and manage restocking requirements.

The application uses a client-server architecture. The backend is developed using Java and Spring Boot, while Thymeleaf, HTML, CSS and JavaScript are used to render and manage the user interface. Spring Security handles authentication, and Spring Data JPA provides database access.

## 2.2 Existing Technology Stack

| Component | Technology |
|---|---|
| Backend | Java, Spring Boot |
| Frontend | Thymeleaf, HTML, CSS, JavaScript |
| Authentication | Spring Security |
| Data access | Spring Data JPA |
| Database | MySQL (local development) |
| Build tool | Maven |
| Version control | Git and GitHub |

## 2.3 Existing Functionalities

The original application provides the following functionality:

- User registration and login.
- User-specific food inventory management.
- Adding food items with names, categories, quantities and expiry dates.
- Updating food quantities and restocking status.
- Deleting food items.
- Displaying food expiry status.
- Searching and filtering food inventory.

## 2.4 Existing Dashboard Interface Audit

The existing dashboard is primarily displayed in Japanese. Japanese text is hardcoded in the HTML document, including the page title, application heading, welcome message, logout button, food counter, search placeholder, inventory filters, food form labels and category options.

The HTML document also specifies `lang="ja"`, meaning the page is explicitly configured for Japanese.

The audit identified these limitations:

- No language selection option is available.
- Interface labels and placeholders are hardcoded in Japanese.
- Food category labels are displayed in Japanese.
- Users cannot select and retain their preferred interface language.
- Dynamic interface elements also require investigation to identify hardcoded Japanese messages.

## 2.5 Identified Limitations and Opportunities

The existing system provides basic refrigerator inventory management, but three areas have been identified for enhancement:

1. **Multilingual accessibility:** The interface needs English, Japanese and Nepali language support.
2. **Food waste management:** The original application does not provide a dedicated process for recording and analysing discarded food.
3. **Recipe recommendations:** The application does not provide AI-powered recipes based on a user's existing food inventory.

## 2.6 Proposed Improvements

The project will extend the existing application rather than replace it. The team will preserve its core authentication and inventory functionality while introducing multilingual support, food waste tracking and AI-powered recipe recommendations.

The enhancements will be implemented and evaluated through requirements analysis, software development, testing and documented evidence.

## 2.7 Login Page Audit

The existing login page is implemented using Thymeleaf and HTML. Its interface text is hardcoded in Japanese.

The audit identified the following elements:

- Japanese page title and login heading.
- Username and password labels.
- Username and password input placeholders.
- Login button.
- Authentication failure message.
- Successful registration confirmation message.
- Signup prompt and registration link.

The HTML document does not specify a dynamic language attribute and does not provide a language selector.

**Identified limitation:** Users cannot change the login interface language. Authentication error messages and registration confirmation messages are also displayed only in Japanese.

**Proposed improvement:** Integrate the login page with the application's multilingual system while preserving Spring Security authentication and existing login behaviour.


## 2.8 Signup Page Audit

The existing signup page is implemented using Thymeleaf and HTML. All static interface text is hardcoded in Japanese.

The audit identified the following elements:

- Japanese page title and registration heading.
- Username and password labels.
- Username and password placeholders.
- Account creation button.
- Existing account prompt and login navigation link.
- Backend-provided registration error message.

The HTML document does not specify a dynamic language attribute or provide a language selector.

The registration error is supplied through the Thymeleaf `errorMessage` model attribute. Therefore, multilingual support must also account for backend-generated error messages.

**Identified limitation:** Users cannot select another interface language during registration, and registration errors may remain Japanese even if the static page text is translated.

**Proposed improvement:** Integrate the signup page and backend validation messages with the multilingual system while preserving existing registration functionality and password security.

## 2.9 JavaScript Functionality Audit

The existing application uses JavaScript to manage authentication status, retrieve inventory records, display food cards, filter items, add food, update food information and delete inventory records.

The audit identified several hardcoded Japanese messages and labels, including:

- Logout confirmation.
- Stock availability messages.
- Restocking labels.
- Expiry date and quantity labels.
- Date update and delete buttons.
- Input validation alerts.
- Network and communication error messages.
- Food deletion confirmation.

These messages are generated dynamically by JavaScript and cannot be translated simply by changing the static HTML templates.

### Additional Technical Findings

**1. Potential Cross-Site Scripting (XSS)**

The `displayFoods()` function uses `innerHTML` to insert food names, categories and other data into the page. User-provided values should be rendered safely using DOM methods such as `textContent` to reduce the risk of XSS vulnerabilities.

**2. Inventory Deletion and Food Waste**

The existing delete operation permanently removes a food item from the inventory. Its confirmation message suggests that the food has been consumed, but the application does not distinguish between consumed food and discarded food.

This limitation will be addressed through a separate food waste recording feature.

### Proposed Improvements

- Introduce multilingual JavaScript messages for English, Japanese and Nepali.
- Translate dynamically generated food cards and status messages.
- Localise validation, confirmation and error messages.
- Improve safe DOM rendering to prevent unsafe HTML insertion.
- Separate ordinary inventory deletion from explicit food waste recording.

## 2.10 Backend Food Model Audit

The existing `Food` entity is implemented using Java Persistence API (JPA) and represents food items stored in the application's database.

It contains fields for food name, expiry date, category, quantity, restocking status and the associated user.

The entity also provides two methods for calculating food status:

- `getStatus()` determines whether an item is safe, approaching expiry or expired.
- `getStatusMessage()` generates a descriptive message based on the food's quantity and expiry date.

### Identified Limitations

1. The `getStatusMessage()` method generates messages directly in Japanese.
2. Bean validation annotations contain hardcoded Japanese error messages.
3. Backend-generated messages are not currently integrated with a multilingual message system.
4. The food status calculation is separate from the displayed message, providing an opportunity to preserve language-independent status codes.

### Proposed Improvements

- Retain the existing status codes (`safe`, `warning` and `danger`) for application logic.
- Introduce multilingual message resolution for food status messages.
- Localise validation messages using Spring Boot message bundles.
- Keep database values independent of the selected interface language.

## 2.11 User Entity Audit

The existing `User` entity represents registered application users. It contains four fields:

- `id`: Unique user identifier.
- `username`: User's login username.
- `password`: Stored password credential.
- `enabled`: Indicates whether the account is enabled.

The entity does not currently contain a language preference field.

### Identified Limitation

The application does not store or manage individual language preferences.

### Proposed Improvement

The project will introduce browser-based language preference persistence using Spring's `CookieLocaleResolver`.

This approach avoids unnecessary database schema changes while allowing users to retain their selected interface language in the same browser.

## 2.12 User Registration Service Audit

The existing `UserService` handles new user registration.

Its responsibilities include:

- Checking whether a username already exists.
- Encoding passwords using the configured password encoder.
- Creating a new user account.
- Enabling the registered account.
- Saving the user record through `UserRepository`.

### Identified Limitation

The service throws a `RuntimeException` containing a hardcoded Japanese message when a username is already registered.

This means registration error messages are not currently language-independent.

### Proposed Improvement

Introduce localised registration error handling so that users receive the appropriate message in English, Japanese or Nepali.

The existing username uniqueness check and password encoding functionality must remain unchanged.



## 2.13 User Controller Audit

The existing `UserController` manages page navigation, user registration and authentication status.

Its main responsibilities include:

- Displaying the dashboard.
- Displaying login and signup pages.
- Processing registration requests.
- Handling registration errors.
- Providing authentication status through a REST endpoint.

### Identified Limitations

1. Registration errors are passed directly from backend exceptions to the signup template.
2. Error messages are currently hardcoded in Japanese in the service layer.
3. The controller catches all `RuntimeException` instances, potentially exposing unexpected internal error messages.
4. No explicit language selection or locale management is implemented.

### Proposed Improvements

- Integrate controller responses with the multilingual message system.
- Use specific registration exceptions and localised messages.
- Preserve existing authentication and registration behaviour.
- Avoid exposing unexpected internal exceptions to users.

## 2.14 Security Configuration Audit

The application uses Spring Security to manage authentication and access control.

The existing security configuration provides:

- Public access to login and registration pages.
- Public access to CSS, JavaScript and image resources.
- Authentication requirements for other application endpoints.
- Form-based login.
- Session invalidation during logout.
- Password encoding using BCrypt.

### Identified Security Consideration

CSRF protection is currently disabled in the Spring Security configuration.

Since the application uses session-based authentication, this configuration requires a separate security review. CSRF protection should be enabled where appropriate, with the necessary token handling implemented for form submissions and JavaScript API requests.

### Localization Considerations

The multilingual enhancement must preserve the existing authentication and access-control behaviour.

Language selection must be available on public and authenticated pages without interfering with login, logout or session management.