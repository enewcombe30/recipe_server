# Flash-POS Backend

The backend service for **Flash-POS**, a modern till system designed for seamless inventory and sales management.

## 🚀 Planned Features

- **User Authentication**: Secure login system using 3-digit codes.
- **Recipe Management**: Recipes with ingredient tracking and automated stock depletion
- **Stock Control**: Hybrid depletion and restocking suggestions.
- **POS Transactions**: Handles real-time sales and order processing.
- **API Documentation**: Detailed API endpoints for seamless integration.

## 🏗️ Tech Stack

- **Backend:** Node.js with Express
- **Database:** PostgreSQL

## 📊 Entity Relationship Diagram (ERD)
![Flash - ERD](https://github.com/user-attachments/assets/98543b2b-712b-464e-9e46-5390a2c2beb6)


## 🎨 Design & UI

Figma Wireframes: [Flash-POS UI Design](https://www.figma.com/design/HVVFbvgHRyP0A4vr7Dtvy7/Flash-POS-wireframes?node-id=0-1&p=f&t=ThmhrLcU8uXzPcth-0) 

## 📡 API Endpoint structure

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/login` | Authenticate user |
| GET | `/recipes` | Fetch all recipes |
| POST | `/recipes` | Add a new recipe |
| PATCH | `/recipes/:id` | Update recipe |
| DELETE | `/recipes/:id` | Delete recipe |
| GET | `/stock` | Get stock levels |
| PATCH | `/stock/:id` | Update stock |


## 📌 Future Enhancements
- Integrate with supplier APIs for automated restocking.
- Implement WebSockets for real-time updates.
- Expand role-based authentication for staff.

---

## 📞 Contact
- Author: **Elijah Newcombe**
- GitHub: [@enewcombe30](https://github.com/enewcombe30)



