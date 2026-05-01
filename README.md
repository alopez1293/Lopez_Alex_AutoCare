# AutoCare Log

AutoCare Log is a mobile app built with React Native and Expo. The app helps users track personal vehicles, view driving conditions, monitor upcoming maintenance, and log service history in one place.

## App Overview

AutoCare Log is designed for everyday vehicle owners who want a simple way to keep track of basic maintenance information. Users can add vehicles, view vehicle details, log service events, and see whether a vehicle is close to its next oil change.

The app also includes a meaningful device feature by allowing users to select a vehicle photo from their device photo library and display it on the vehicle card.

## Main Features

- Garage dashboard with saved vehicles
- Vehicle count and maintenance due summary
- Current driving conditions from a weather API
- Add vehicle form with validation
- Vehicle details screen with mileage, VIN, notes, and oil change status
- Service history tracking for each vehicle
- Add service event form with validation
- Empty states for vehicles with no service history
- Image picker device integration for vehicle photos
- Polished UI with consistent cards, buttons, colors, and spacing

## Device Feature

This project uses the device photo library through Expo Image Picker.

Users can tap **Add Photo** on a vehicle card, grant photo library permission, choose an image from their device, and see the selected image displayed in the app.

This feature fits the purpose of the app because vehicle photos make the garage dashboard more personal and realistic.

## Device Permissions

The app requests photo library / media library permission.

This permission is used only when the user chooses to add a photo to a vehicle card.

## Technologies Used

- React Native
- Expo
- Expo Router
- TypeScript
- Expo Image Picker
- React state management
- Open-Meteo weather API

## How to Run the Project

1. Install dependencies:

```bash
npm install
```

2. Start the Expo development server:

```bash
npx expo start
```

3. Open the app using Expo Go, an emulator, or a connected device.

## Final Project Notes

This final version includes app polish, validation, empty states, a device integration, and a separate store page information document.
