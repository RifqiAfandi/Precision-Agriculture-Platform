import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Search, SlidersHorizontal, Grid, List } from "lucide-react";
import DeviceCard from "./DeviceCard";
import { searchDevices, sortDevices } from "../utils/devicesHelpers";

/**
 * Device List Component
 * Displays a list of devices with search, filter, and sort capabilities
 * 
 * @param {Object} props
 * @param {Array} props.devices - Array of device objects
 * @param {Array} props.installedDevices - Array of installed device IDs
 * @param {Function} props.onNavigate - Navigation handler
 * @param {Function} props.onInstall - Install handler
 * @param {Function} props.onConfigure - Configure handler
 * @param {string} props.title - List title
 * @param {boolean} props.showSearch - Show search bar
 * @param {boolean} props.showFilters - Show filter controls
 * @param {string} props.variant - Card variant to use
 */
const DeviceList = ({
  devices = [],
  installedDevices = [],
  onNavigate,
  onInstall,
  onConfigure,
  title = "Devices",
  showSearch = true,
  showFilters = true,
  variant = "default",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Apply search and sort
  const filteredDevices = searchDevices(devices, searchQuery);
  const sortedDevices = sortDevices(filteredDevices, sortBy, sortOrder);

  const isDeviceInstalled = (deviceId) => installedDevices.includes(deviceId);

  return (
    <div className="space-y-4">
      {/* Header with title and controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? (
              <List className="w-4 h-4" />
            ) : (
              <Grid className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="flex flex-col md:flex-row gap-3">
          {showSearch && (
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search devices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {showFilters && (
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Device Grid/List */}
      {sortedDevices.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          }
        >
          {sortedDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              isInstalled={isDeviceInstalled(device.id)}
              onNavigate={onNavigate}
              onInstall={onInstall}
              onConfigure={onConfigure}
              variant={viewMode === "list" ? "compact" : variant}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? "No devices found matching your search" : "No devices available"}
          </p>
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-gray-500 text-center">
        Showing {sortedDevices.length} of {devices.length} devices
        {installedDevices.length > 0 && ` (${installedDevices.length} installed)`}
      </div>
    </div>
  );
};

export default DeviceList;
