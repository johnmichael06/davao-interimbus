// src/data/routes.js

// 1. Load all JSON files from the folder
// NOTE: This assumes your folder structure is: src/data/routes.js AND src/json_routes/
const routeModules = import.meta.glob("../json_routes/*.json", { eager: true });

console.log(
  `[Davao Bus App] Found ${Object.keys(routeModules).length} JSON files.`,
);

// Helper: Convert 24h to 12h format
function to12HourFormat(hour) {
  if (hour === undefined || hour === null) return "";
  const period = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  return `${h}:00 ${period}`;
}

// Helper: Generate time slots
function generateTimeSlots(start, end) {
  if (!start || !end) return [];
  const slots = [];
  try {
    let current = parseInt(start.split(":")[0]);
    const endHour = parseInt(end.split(":")[0]);
    while (current <= endHour) {
      slots.push(to12HourFormat(current));
      current++;
    }
  } catch (e) {
    console.warn("Error generating time slots:", e);
  }
  return slots;
}

// 2. Process Data
const processedRoutes = {};

Object.keys(routeModules).forEach((path) => {
  try {
    const module = routeModules[path];
    const data = module.default || module;

    // Safety check: Does this JSON have the basics?
    if (!data || !data.route_number) {
      console.warn(`Skipping invalid file: ${path}`, data);
      return;
    }

    const routeId = data.route_number;

    // Initialize Route Object if not exists
    if (!processedRoutes[routeId]) {
      processedRoutes[routeId] = {
        id: routeId,
        route_number: data.route_number || "???",
        name: data.name || "Unknown Route",
        area: data.area || "Davao City",
        color: "#0FA4A9", // Default Teal if missing
        schedule: { am: [], pm: [] },
        points: [],
      };
    }

    // Process Schedule
    const timeSlots = generateTimeSlots(data.start_time, data.end_time);
    if (data.time_period === "AM") {
      processedRoutes[routeId].schedule.am = timeSlots;
    } else {
      processedRoutes[routeId].schedule.pm = timeSlots;
    }

    // Process Points (Only if this file has points)
    // We prioritize AM points, or just take the first set we find
    if (data.points && Array.isArray(data.points)) {
      // Only overwrite points if we don't have them, or if this is the AM file (usually preferred)
      if (
        processedRoutes[routeId].points.length === 0 ||
        data.time_period === "AM"
      ) {
        processedRoutes[routeId].points = data.points.map((p) => ({
          lat: p.latitude,
          lng: p.longitude,
          kind: p.kind || "waypoint",
          name: p.name || "",
        }));
      }
    }
  } catch (err) {
    console.error(`Error processing file ${path}:`, err);
  }
});

const finalRoutes = Object.values(processedRoutes);
console.log(
  `[Davao Bus App] Successfully loaded ${finalRoutes.length} unique routes.`,
);

export const routesData = finalRoutes;
