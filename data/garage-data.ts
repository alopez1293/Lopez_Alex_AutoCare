export type Vehicle = {
  id: string;
  name: string;
  mileage: number;
  nextOilDue: number;
  vin: string;
  notes: string;
};

export type ServiceEvent = {
  id: string;
  vehicleId: string;
  date: string;
  service: string;
  mileage: number;
  cost: number;
  notes?: string;
};

export const VEHICLES: Vehicle[] = [
  {
    id: "1",
    name: "2016 Ford F-150",
    mileage: 142300,
    nextOilDue: 145000,
    vin: "1FTEW1EP0GKD12345",
    notes: "Needs new wipers soon.",
  },
  {
    id: "2",
    name: "2012 Honda Accord",
    mileage: 186050,
    nextOilDue: 186500,
    vin: "1HGCP2F3XCA123456",
    notes: "Check tire pressure monthly.",
  },
];

export const SERVICE_HISTORY: ServiceEvent[] = [
  {
    id: "s1",
    vehicleId: "1",
    date: "2025-11-02",
    service: "Oil Change",
    mileage: 139800,
    cost: 58.99,
    notes: "Full synthetic oil",
  },
  {
    id: "s2",
    vehicleId: "1",
    date: "2025-08-14",
    service: "Tire Rotation",
    mileage: 136200,
    cost: 25.0,
    notes: "Rotation completed",
  },
  {
    id: "s3",
    vehicleId: "2",
    date: "2025-10-20",
    service: "Brake Inspection",
    mileage: 185200,
    cost: 40.0,
    notes: "Front pads good",
  },
];
