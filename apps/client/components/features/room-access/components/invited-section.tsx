/**
 * Room joining form section component for invited users.
 * Features:
 * - Name input validation
 * - Submit handling
 * - Loading states
 * - Error display
 *
 *
 */

import { ArrowRight } from 'lucide-react';
import type { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/shared/spinner';

import type { JoinRoomForm } from '../lib/types';

interface InvitedSectionProps {
  register: UseFormRegister<JoinRoomForm>;
  handleSubmit: UseFormHandleSubmit<JoinRoomForm>;
  onSubmit: (data: JoinRoomForm) => Promise<boolean> | undefined;
  onError: () => void;
  errors: FieldErrors<JoinRoomForm>;
  isSubmitting: boolean;
  isCreating: boolean;
}

export const InvitedSection = ({
  register,
  handleSubmit,
  onSubmit,
  onError,
  errors,
  isSubmitting,
  isCreating
}: InvitedSectionProps) => {
  const isDisabled = isCreating || isSubmitting;
  const nameErrorId = 'invited-name-error';

  return (
    <section aria-label="Join Room Form">
      <form
        onSubmit={handleSubmit(data => onSubmit(data), onError)}
        className="flex flex-col gap-y-4"
        noValidate
      >
        <div className="flex flex-col space-y-3 pb-2" role="group" aria-labelledby="name-join">
          <Label htmlFor="name-join" className="font-mono text-sm sm:text-sm">
            Name
          </Label>
          <Input
            id="name-join"
            placeholder="Enter your name"
            className="border border-white/30 font-mono text-sm focus-visible:ring-1 focus-visible:ring-[#8420FF]
              focus-visible:ring-offset-0 sm:text-sm"
            disabled={isDisabled}
            aria-required="true"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? nameErrorId : undefined}
            {...register('name')}
          />
          {errors.name && (
            <p id={nameErrorId} className="text-xs text-red-500" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isDisabled}
          aria-busy={isSubmitting}
          className={`w-4/3 group relative mx-auto flex items-center justify-center overflow-hidden rounded-full
            bg-gradient-to-r from-blue-700 to-purple-600 py-2 font-mono text-xs text-white shadow-md
            transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 disabled:opacity-60`}
        >
          <span
            className="pointer-events-none absolute inset-0 rounded-full bg-white opacity-0 transition-all duration-300
              group-active:opacity-10"
          />
          {isSubmitting ? (
            <>
              <Spinner className="mr-2 h-5 w-5 animate-spin transition-transform duration-300" />
              Joining...
            </>
          ) : (
            <>
              _ Join Room
              <ArrowRight
                className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </>
          )}
        </Button>
      </form>
    </section>
  );
};
