
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
      // Test basic connection by getting current timestamp from database
      // We'll use a simple query instead of an RPC function to avoid type issues
      const { data: timeData, error: timeError } = await supabase
        .from('table_name') // Using an existing table from your schema
        .select('inserted_at')
        .limit(1);
      
      if (timeError) throw timeError;
      
      // Check specific tables we know exist in the database schema
      const tablesToCheck = ['users', 'payments', 'reservations', 'stores'] as const;
      const availableTables: string[] = [];
      
      for (const tableName of tablesToCheck) {
        try {
          // Just see if we can select a single row from each table
          const { error } = await supabase
            .from(tableName)
            .select('id')
            .limit(1);
          
          // If no error or only a permission error but table exists
          if (!error || error.code === "PGRST116") {
            availableTables.push(tableName);
          }
        } catch (err) {
          // Ignore errors for individual tables
          console.log(`Table check error for ${tableName}:`, err);
        }
      }
      
      setDbTables(availableTables);
      
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
        <Badge variant={connectionStatus === 'connected' ? 'secondary' : connectionStatus === 'checking' ? 'outline' : 'destructive'}>
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
            <span className="font-medium">Project URL:</span> {"https://vpzhincrxgxyyzulmrzs.supabase.co"}
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
