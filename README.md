# URL Shortener with Express and Prisma

This is a URL shortener project developed with Express.js, TypeScript and Prisma as the ORM for database management.

## 📦 Installation

1. Clone this repository:
   ```sh
   git clone https://github.com/CarSeP/url-shortener.git
   cd url-shortener
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up the database:
   - Create a `.env` file in the root directory with these variables:
     ```
     PORT="3000"
     DATABASE_URL="file:./dev.db"
     ```
   - Run Prisma migrations:
     ```sh
     npx prisma migrate dev --name init
     ```

## 🖥 FrontEnd

The project includes a FrontEnd in the root of the url

## 🛠 Usage

1. Start the server:
   ```sh
   npm run dev
   ```
2. Available endpoints:
   - `POST /` → Shorten a URL.
   - `GET /:id` → Redirect to the original URL.
