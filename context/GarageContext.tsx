import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import {
    SERVICE_HISTORY as INITIAL_SERVICE_HISTORY,
    VEHICLES as INITIAL_VEHICLES,
    ServiceEvent,
    Vehicle,
} from "../data/garage-data";

type AddServiceEventInput = {
  vehicleId: string;
  date: string;
  service: string;
  mileage: number;
  cost: number;
  notes?: string;
};

type AddVehicleInput = {
  name: string;
  mileage: number;
  nextOilDue: number;
  vin: string;
  notes: string;
};

type GarageContextType = {
  vehicles: Vehicle[];
  serviceHistory: ServiceEvent[];
  addServiceEvent: (input: AddServiceEventInput) => void;
  addVehicle: (input: AddVehicleInput) => void;
};

const GarageContext = createContext<GarageContextType | undefined>(undefined);

export function GarageProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [serviceHistory, setServiceHistory] = useState<ServiceEvent[]>(
    INITIAL_SERVICE_HISTORY,
  );

  const addServiceEvent = (input: AddServiceEventInput) => {
    const newEvent: ServiceEvent = {
      id: `s${Date.now()}`,
      vehicleId: input.vehicleId,
      date: input.date,
      service: input.service,
      mileage: input.mileage,
      cost: input.cost,
      notes: input.notes?.trim() || "",
    };

    setServiceHistory((current) => [newEvent, ...current]);

    setVehicles((current) =>
      current.map((vehicle) =>
        vehicle.id === input.vehicleId
          ? {
              ...vehicle,
              mileage: input.mileage,
            }
          : vehicle,
      ),
    );
  };

  const addVehicle = (input: AddVehicleInput) => {
    const newVehicle: Vehicle = {
      id: `${Date.now()}`,
      name: input.name,
      mileage: input.mileage,
      nextOilDue: input.nextOilDue,
      vin: input.vin,
      notes: input.notes,
    };

    setVehicles((current) => [...current, newVehicle]);
  };

  const value = useMemo(
    () => ({
      vehicles,
      serviceHistory,
      addServiceEvent,
      addVehicle,
    }),
    [vehicles, serviceHistory],
  );

  return (
    <GarageContext.Provider value={value}>{children}</GarageContext.Provider>
  );
}

export function useGarage() {
  const context = useContext(GarageContext);

  if (!context) {
    throw new Error("useGarage must be used inside a GarageProvider");
  }

  return context;
}
