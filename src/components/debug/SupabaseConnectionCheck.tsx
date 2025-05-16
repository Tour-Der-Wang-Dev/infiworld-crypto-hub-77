
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export const SupabaseConnectionCheck = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);
  const [dbTables, setDbTables] = useState<string[]>([]);
  const [authEnabled, setAuthEnabled] = useState<boolean | null>(null);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    setError(null);
    
    try {
      // Test basic connection by getting server time
      const { data: timeData, error: timeError } = await supabase.rpc('get_server_time');
      
      if (timeError) throw timeError;
      
      // Get list of tables to check metadata access
      const { data: tablesData, error: tablesError } = await supabase
        .from('pg_catalog.pg_tables')
        .select('tablename')
        .eq('schemaname', 'public');
      
      if (tablesError) {
        console.log('Tables access error (expected for non-admin users):', tablesError);
        // This might fail due to RLS, which is actually good
      } else if (tablesData) {
        setDbTables(tablesData.map(t => t.tablename));
      }
      
      // Check if auth is configured
      const { data: authData, error: authError } = await supabase.auth.getSession();
      if (authError) {
        console.error('Auth error:', authError);
      } else {
        setAuthEnabled(true);
      }
      
      setConnectionStatus('connected');
    } catch (err: any) {
      console.error('Connection error:', err);
      setConnectionStatus('error');
      setError(err.message || 'Unknown connection error');
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Supabase Connection Status</h3>
        <Badge variant={connectionStatus === 'connected' ? 'success' : connectionStatus === 'checking' ? 'outline' : 'destructive'}>
          {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'checking' ? 'Checking...' : 'Error'}
        </Badge>
      </div>
      
      {connectionStatus === 'error' && (
        <Alert variant="destructive">
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>{error || 'Failed to connect to Supabase'}</AlertDescription>
        </Alert>
      )}
      
      {connectionStatus === 'connected' && (
        <div className="space-y-2">
          <div>
            <span className="font-medium">Project ID:</span> {supabase.supabaseUrl.split('//')[1].split('.')[0]}
          </div>
          <div>
            <span className="font-medium">Auth Status:</span> {authEnabled === true ? 'Enabled' : authEnabled === false ? 'Disabled' : 'Unknown'}
          </div>
          {dbTables.length > 0 && (
            <div>
              <span className="font-medium">Available Tables:</span> 
              <div className="flex flex-wrap gap-1 mt-1">
                {dbTables.map((table) => (
                  <Badge key={table} variant="secondary">{table}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <Button onClick={checkConnection} variant="outline" size="sm">
        Retest Connection
      </Button>
    </div>
  );
};
