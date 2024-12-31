<h1 align="center" id="title">Shortify.NET - Frontend</h1>

<p align="center"><img src="https://github.com/ScriptSage001/Shortify.NET/blob/master/Assets/Images/Logo.png?raw=true" alt="logo"></p>

<p align="center"><img src="https://socialify.git.ci/ScriptSage001/Shortify.Net-Client/image?custom_description=A+powerful+URL+shortening+platform+that+simplifies+sharing+links.&description=1&font=Raleway&language=1&name=1&owner=1&theme=Auto" alt="project-image"></p>

Welcome to the Angular-based frontend of **Shortify.NET**, a powerful URL shortening platform that simplifies sharing links. This application provides an interactive user interface for managing shortened URLs, enabling user-friendly authentication and various URL management features.

## ✨ Live Demo
Explore the application here: [https://shortify-net.web.app/](https://shortify-net.web.app/)

---

## 🧩 Features
- **Authentication**: Login via OTP or email-password.
- **Password Management**: Forget password and reset password features.
- **Link Management**:
  - View links with destination URL favicons on the dashboard and detail screens.
  - Edit functionality to update destination URLs while keeping the short URL unchanged.
  - Delete URLs.
  - Direct sharing on multiple social platforms.
- **Security**:
  - JWT-based authentication.
  - Refresh tokens to extend idle login time.
- **Upcoming Features**:
  - Advanced analytics for tracking URL performance.

> **Note**: Role-based access control (RBAC) features are supported on the backend but not yet implemented in the UI.

---

## 🛠️ Installation and Setup

### Prerequisites
Ensure the following are installed on your system:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Angular CLI](https://angular.io/cli)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/ScriptSage001/Shortify.Net-Client.git
   cd shortify.net-client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment:
   - Update `src/environments/environment.ts` and `src/environments/environment.prod.ts` files with the appropriate API URLs.
4. Run the application in development mode:
   ```bash
   ng serve
   ```
   Access the app at `http://localhost:4200/`.
5. Build the application for production:
   ```bash
   ng build --configuration=production
   ```

---

## 🍰 Contribution
We welcome contributions! Please follow the guidelines outlined below:

1. Fork the repository and create a new branch for your feature or bug fix.
2. Ensure your changes adhere to the Angular coding standards.
3. Test your changes thoroughly.
4. Submit a pull request with a detailed description of your changes.

---

## 🌟 Acknowledgments
This project leverages several open-source libraries and tools:
- [Angular](https://angular.io/)
- [RxJS](https://rxjs.dev/)
- [Ng-Bootstrap](https://ng-bootstrap.github.io/)
- [Font Awesome](https://fontawesome.com/)
- [Ngx-Spinner](https://www.npmjs.com/package/ngx-spinner)
- [Ngx-Toastr](https://github.com/scttcper/ngx-toastr)

Thank you to the contributors and maintainers of these libraries for their incredible work!

---

## 🛡️ License
<p>This project is licensed under the Apache License. See the <a href="https://github.com/ScriptSage001/Shortify.Net-Client/blob/master/LICENSE.txt">LICENSE</a> file for details.</p>

---

## 📸 Screenshots
<p align="center"><img src="https://github.com/ScriptSage001/Shortify.Net-Client/blob/master/Assets/Images/UI%200.png?raw=true" alt="ui-landing"></p>
<p align="center"><img src="https://github.com/ScriptSage001/Shortify.Net-Client/blob/master/Assets/Images/UI%201.png?raw=true" alt="ui-sign-in-with-password"></p>
<p align="center"><img src="https://github.com/ScriptSage001/Shortify.Net-Client/blob/master/Assets/Images/UI%202.png?raw=true" alt="ui-sign-in-with-otp"></p>
<p align="center"><img src="https://github.com/ScriptSage001/Shortify.Net-Client/blob/master/Assets/Images/UI%203.png?raw=true" alt="ui-sign-up"></p>
<p align="center"><img src="https://github.com/ScriptSage001/Shortify.Net-Client/blob/master/Assets/Images/UI%204.png?raw=true" alt="ui-dashboard"></p>
<p align="center"><img src="https://github.com/ScriptSage001/Shortify.Net-Client/blob/master/Assets/Images/UI%205.png?raw=true" alt="ui-links-list"></p>
<p align="center"><img src="https://github.com/ScriptSage001/Shortify.Net-Client/blob/master/Assets/Images/UI%206.png?raw=true" alt="ui-delete-link-popup"></p>
