export const trees = [
  {
    id: "1",
    name: "Jati Unggul A1",
    species: "Jati",
    age: 24,
    location: "Blok A - Baris 1",
    coordinates: { lat: -6.2088, lng: 106.8456 },
    lastMeasurement: "2024-08-01 09:30",
    currentDBH: 18.5,
    previousDBH: 17.8,
    plantedDate: "2022-08-15",
    status: "growing",
    growthRate: 0.7,
    estimatedVolume: 0.12,
  },
  {
    id: "2",
    name: "Sengon Super B2",
    species: "Sengon",
    age: 18,
    location: "Blok B - Baris 2",
    coordinates: { lat: -6.209, lng: 106.846 },
    lastMeasurement: "2024-07-30 10:15",
    currentDBH: 12.3,
    previousDBH: 11.9,
    plantedDate: "2023-02-10",
    status: "optimal",
    growthRate: 0.4,
    estimatedVolume: 0.05,
  },
  {
    id: "3",
    name: "Karet Klon C3",
    species: "Karet",
    age: 36,
    location: "Blok C - Baris 3",
    coordinates: { lat: -6.2085, lng: 106.8465 },
    lastMeasurement: "2024-07-28 08:45",
    currentDBH: 25.7,
    previousDBH: 25.6,
    plantedDate: "2021-08-01",
    status: "slow",
    growthRate: 0.1,
    estimatedVolume: 0.28,
  },
];

export const growthData = [
  { month: "Jan", dbh: 16.2, volume: 0.08 },
  { month: "Feb", dbh: 16.5, volume: 0.09 },
  { month: "Mar", dbh: 16.8, volume: 0.09 },
  { month: "Apr", dbh: 17.1, volume: 0.1 },
  { month: "May", dbh: 17.3, volume: 0.1 },
  { month: "Jun", dbh: 17.6, volume: 0.11 },
  { month: "Jul", dbh: 17.8, volume: 0.11 },
  { month: "Agu", dbh: 18.5, volume: 0.12 },
];

export const speciesOptions = [
  "Jati",
  "Sengon",
  "Karet",
  "Mahoni",
  "Meranti",
  "Akasia",
  "Eukaliptus",
  "Pinus",
];

export const getTreeStatistics = (treesData = trees) => {
  const totalTrees = treesData.length;
  const avgDBH = (
    treesData.reduce((sum, tree) => sum + tree.currentDBH, 0) / totalTrees
  ).toFixed(1);
  const activeGrowth = treesData.filter(
    (tree) => tree.status === "optimal" || tree.status === "growing"
  ).length;
  const totalVolume = treesData
    .reduce((sum, tree) => sum + tree.estimatedVolume, 0)
    .toFixed(2);

  return {
    totalTrees,
    avgDBH,
    activeGrowth,
    totalVolume,
  };
};
