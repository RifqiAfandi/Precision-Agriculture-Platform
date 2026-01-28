import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Wifi, WifiOff, Loader2, RefreshCw } from 'lucide-react';

/**
 * Connection Status Component
 * 
 * Displays connection status with device count and refresh button
 * Used in dashboard headers to show Firebase/API connection state
 * 
 * @example
 * <ConnectionStatus
 *   connected={true}
 *   deviceCount={10}
 *   onRefresh={handleRefresh}
 *   loading={false}
 *   lastUpdate={new Date()}
 * />
 */
export function ConnectionStatus({
  connected,
  deviceCount = 0,
  onRefresh,
  loading = false,
  lastUpdate = null,
  connectedLabel = 'Data Real-time Aktif',
  offlineLabel = 'Offline',
  className = '',
}) {
  return (
    <div className={`flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 ${className}`}>
      <div className="flex items-center gap-3 flex-wrap">
        {connected ? (
          <>
            <Wifi className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-600 font-medium">{connectedLabel}</span>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">{offlineLabel}</span>
          </>
        )}
        <Badge variant="outline" className="ml-2">
          {deviceCount} devices
        </Badge>
        {lastUpdate && (
          <span className="text-xs text-gray-400">
            Update: {lastUpdate.toLocaleTimeString('id-ID')}
          </span>
        )}
      </div>
      {onRefresh && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </>
          )}
        </Button>
      )}
    </div>
  );
}

ConnectionStatus.propTypes = {
  connected: PropTypes.bool.isRequired,
  deviceCount: PropTypes.number,
  onRefresh: PropTypes.func,
  loading: PropTypes.bool,
  lastUpdate: PropTypes.instanceOf(Date),
  connectedLabel: PropTypes.string,
  offlineLabel: PropTypes.string,
  className: PropTypes.string,
};

export default ConnectionStatus;
