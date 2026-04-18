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
import { Spinner } from '@/components/shared/spinner';

import type { TestResult } from './lib/types';
import { calculateStats } from './lib/utils';

const DEFAULT_ITERATIONS = 3;
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
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card
        className="w-full max-w-3xl rounded-3xl border border-white/10 bg-black/10 p-2 shadow-2xl backdrop-blur-xl
          sm:p-4"
      >
        {/* Back Button */}
        <Button
          variant="link"
          asChild
          className="flex items-center gap-1 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text px-0
            font-medium text-transparent transition-all duration-300 hover:scale-105"
        >
          <a href={BASE_CLIENT_URL}>
            <ArrowLeft className="h-5 w-5 text-purple-500" />
            <span>Go back</span>
          </a>
        </Button>

        {/* Header */}
        <CardHeader className="mt-[-16px] p-4">
          <CardTitle className="text-center font-mono text-sm sm:text-lg">
            Server Latency Test
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mb-[-8px] flex flex-col items-center space-y-6">
            {/* Input + Action */}
            <div className="flex w-full items-end justify-center gap-4">
              {/* Input */}
              <div className="space-y-1.5 pl-12 sm:pl-32">
                <Label htmlFor="iterations" className="font-mono text-sm sm:text-sm">
                  Number of Tests
                </Label>
                <Input
                  id="iterations"
                  type="number"
                  min={MIN_ITERATIONS}
                  max={MAX_ITERATIONS}
                  value={iterations}
                  onChange={handleIterationChange}
                  className="w-4/3 mx-auto rounded-full border border-white/30 font-mono text-sm focus-visible:ring-1
                    focus-visible:ring-[#8420FF] focus-visible:ring-offset-0 sm:text-sm"
                  disabled={isTesting}
                />
              </div>

              {/* Button */}
              <Button
                onClick={measureLatency}
                disabled={isTesting || isConnecting}
                className="w-4/3 relative mx-auto flex items-center justify-center overflow-hidden rounded-full
                  bg-gradient-to-r from-blue-700 to-purple-600 py-2 font-mono text-xs shadow-md transition-all
                  duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 disabled:opacity-60"
              >
                <span
                  className="pointer-events-none absolute inset-0 rounded-full bg-white opacity-0 transition-all duration-300
                    group-active:opacity-10"
                />

                {isConnecting ? (
                  <>
                    <Spinner className="mr-2 h-5 w-5 animate-spin" />
                    Connecting...
                  </>
                ) : isTesting ? (
                  <>
                    <Spinner className="mr-2 h-5 w-5 animate-spin" />
                    Testing ({testCount}/{iterations})
                  </>
                ) : (
                  'Start Tests'
                )}
              </Button>
            </div>

            {/* Error */}
            {error && <p className="text-xs text-red-500">{error}</p>}

            {/* Tables */}
            {results.length > 0 && (
              <div className="space-y-6">
                {/* Results Table */}
                <Table className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm backdrop-blur-lg">
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
                  <Table
                    className="w-full table-fixed overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-center text-sm
                      backdrop-blur-lg"
                  >
                    <TableHeader>
                      <TableRow className="">
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
