# 🗓️ Calendar App (Google Calendar Clone)

This is a dynamic and interactive calendar application that functions similarly to Google Calendar. Users can create, edit, move, resize, and delete events. It also supports goal-based task scheduling with full CRUD operations and drag-and-drop capabilities.

---

## 📌 Features

### 📅 Calendar Functionality
- **Create Events:** Click on any calendar cell to open a modal dialog where you can input event details:
  - **Title**
  - **Category:** Dropdown with 6 options — `exercise`, `eating`, `work`, `relax`, `family`, `social`
  - **Date & Time:** Start and end time
- **Drag & Drop:** Move events around the calendar to different days or times.
- **Precise Timing:** Supports events as short as 15 minutes (e.g., 8:15 AM - 8:30 AM).
- **Resize Events:** Expand or contract events by dragging their edges.
- **Delete Events:** Easily remove events from the calendar.

### 📋 Goals & Tasks Panel (Left Sidebar)
- **Database Integration:** Fetches two lists — Goals and corresponding Tasks — from the database.
- **Task Mapping:**
  - Clicking on a Goal populates related tasks in the sidebar.
  - Tasks share the same color as their respective Goal.
- **Drag & Drop Tasks:** Drag a task onto the calendar to auto-create a pre-filled event:
  - **Name:** Pre-filled with the task name
  - **Time/Date:** Based on drop location
  - **Color:** Matches the selected Goal

---

## 🛠️ Tech Stack

- **Frontend:** React, Redux, Tailwind CSS (or preferred CSS framework)
- **State Management:** Redux (Global state handling)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **API Routes:** Supports `GET`, `POST`, and `PUT` methods for event data handling
