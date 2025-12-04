/**
 * Latency test component for measuring connection performance.
 * Features:
 * - HTTP/Socket latency tests
 * - Multiple test iterations
 * - Statistical analysis
 * - Results visualization
 *
*
 */

'use client';

import { useEffect, useState, type ChangeEvent } from 'react';

import { ArrowLeft } from 'lucide-react';
import { Socket } from 'socket.io-client';

import { BASE_CLIENT_URL, BASE_SERVER_URL } from '@/lib/constants';
import { getSocket } from '@/lib/socket';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Spinner } from '@/components/spinner';

import type { TestResult } from './types';
import { calculateStats } from './utils';

const DEFAULT_ITERATIONS = 10;
const MIN_ITERATIONS = 1;
const MAX_ITERATIONS = 50;

const LatencyTest = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testCount, setTestCount] = useState(0);
  const [iterations, setIterations] = useState(DEFAULT_ITERATIONS);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);

  // Initialize socket connection on component mount
  useEffect(() => {
    const newSocket = getSocket();
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnecting(false);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleIterationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setIterations(Math.min(Math.max(value, MIN_ITERATIONS), MAX_ITERATIONS));
    }
  };

  const singleTest = async (): Promise<{ http: number; socket: number }> => {
    if (!socket) {
      throw new Error('Socket not initialized');
    }

    const httpStart = performance.now();
    const response = await fetch(BASE_SERVER_URL);

    if (!response.ok) {
      throw new Error('HTTP request failed');
    }

    const httpLatency = Math.round(performance.now() - httpStart);

    const socketLatency = await new Promise<number>((resolve, reject) => {
      const start = performance.now();
      const timeout = setTimeout(() => {
        reject(new Error('Socket ping timeout'));
      }, 5000);

      socket.emit('ping');
      socket.once('pong', () => {
        clearTimeout(timeout);
        resolve(Math.round(performance.now() - start));
      });
    });

    return { http: httpLatency, socket: socketLatency };
  };

  const measureLatency = async () => {
    if (!socket?.connected) {
      setError('Socket not connected');
      return;
    }

    setIsTesting(true);
    setError(null);
    setResults([]);
    setTestCount(0);

    try {
      for (let i = 0; i < iterations; i++) {
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const result = await singleTest();
        setResults(prev => [
          ...prev,
          {
            id: i + 1,
            http: result.http,
            socket: result.socket,
            timestamp: new Date().toISOString()
          }
        ]);
        setTestCount(i + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Latency test error:', err);
    } finally {
      setIsTesting(false);
    }
  };

  const httpStats = results.length ? calculateStats(results.map(r => r.http)) : null;
  const socketStats = results.length ? calculateStats(results.map(r => r.socket)) : null;

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <Card className="w-full max-w-3xl bg-black/10 backdrop-blur-xl 
        rounded-3xl border border-white/10 shadow-2xl p-2 sm:p-4">
        {/* Back Button */}
        <Button
          variant="link"
          asChild
          className="
            flex items-center px-0 gap-1
            font-medium text-transparent bg-clip-text
            bg-gradient-to-r from-blue-400 via-purple-400 to-green-400
            hover:scale-105 transition-all duration-300
          "
        >
          <a href={BASE_CLIENT_URL}>
            <ArrowLeft className="w-5 h-5 text-purple-500" />
            <span>Go back</span>
          </a>
        </Button>

        {/* Header */}
        <CardHeader className="p-4 mt-[-16px]">
          <CardTitle className="text-white text-sm sm:text-lg text-center font-mono">
            Server Latency Test
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-6 mb-[-8px] flex flex-col items-center">

            {/* Input + Action */}
            <div className="w-full flex justify-center items-end gap-4">

              {/* Input */}
              <div className="space-y-1.5 pl-12 sm:pl-32">
                <Label htmlFor="iterations" className="text-sm font-mono sm:text-sm">
                  Number of Tests
                </Label>
                <Input
                  id="iterations"
                  type="number"
                  min={MIN_ITERATIONS}
                  max={MAX_ITERATIONS}
                  value={iterations}
                  onChange={handleIterationChange}
                  className=" w-4/3 mx-auto
                    font-mono text-sm sm:text-sm
                    focus-visible:ring-1 focus-visible:ring-[#8420FF] focus-visible:ring-offset-0
                    border border-white/30 rounded-full
                  "
                  disabled={isTesting}
                />
              </div>

              {/* Button */}
              <Button
                onClick={measureLatency}
                disabled={isTesting || isConnecting}
                className="
                  w-4/3 mx-auto py-2
                  rounded-full font-mono
                  bg-gradient-to-r from-blue-700 to-purple-600
                  text-white text-xs
                  shadow-md
                  transition-all duration-300
                  hover:scale-105 hover:shadow-2xl
                  active:scale-95
                  disabled:opacity-60
                  flex items-center justify-center
                  relative overflow-hidden
                  
                "
              >
                <span className="absolute inset-0 rounded-full bg-white opacity-0 
                  group-active:opacity-10 transition-all duration-300 pointer-events-none" />

                {isConnecting ? (
                  <>
                    <Spinner className="w-5 h-5 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : isTesting ? (
                  <>
                    <Spinner className="w-5 h-5 mr-2 animate-spin" />
                    Testing ({testCount}/{iterations})
                  </>
                ) : (
                  "Start Tests"
                )}
              </Button>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-xs">{error}</p>
            )}

            {/* Tables */}
            {results.length > 0 && (
              <div className="space-y-6">

                {/* Results Table */}
                <Table className="
                  bg-white/5 text-sm text-white rounded-2xl overflow-hidden 
                  backdrop-blur-lg border border-white/10 text-center
                ">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Test #</TableHead>
                      <TableHead className="text-center">HTTP (ms)</TableHead>
                      <TableHead className="text-center">Socket (ms)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map(result => (
                      <TableRow key={result.id}>
                        <TableCell>{result.id}</TableCell>
                        <TableCell>{result.http}</TableCell>
                        <TableCell>{result.socket}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Stats Table */}
                {httpStats && socketStats && (
                  <Table className="
                    bg-white/5 text-sm text-white rounded-2xl overflow-hidden 
                    backdrop-blur-lg border border-white/10 text-center table-fixed w-full
                  ">
                    <TableHeader >
                      <TableRow className=''>
                        <TableHead className="text-center">Statistics (ms)</TableHead>
                        <TableHead className="text-center">HTTP</TableHead>
                        <TableHead className="text-center">Socket</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Minimum</TableCell>
                        <TableCell>{httpStats.min}</TableCell>
                        <TableCell>{socketStats.min}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Maximum</TableCell>
                        <TableCell>{httpStats.max}</TableCell>
                        <TableCell>{socketStats.max}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Average</TableCell>
                        <TableCell>{httpStats.avg}</TableCell>
                        <TableCell>{socketStats.avg}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Median</TableCell>
                        <TableCell>{httpStats.median}</TableCell>
                        <TableCell>{socketStats.median}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Std Dev</TableCell>
                        <TableCell>{httpStats.stdDev}</TableCell>
                        <TableCell>{socketStats.stdDev}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </div>
            )}

          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { LatencyTest };
