"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { ApiError, createBooking } from "@/services/cars";
import type { BookingPayload } from "@/types/car";
import { Icon } from "@/components/Icon/Icon";
import { Spinner } from "@/components/Spinner/Spinner";
import styles from "./BookingForm.module.css";

type BookingFormProps = {
  carId: string;
};

type FieldErrors = {
  name?: string;
  email?: string;
};

type BookingFields = {
  name: string;
  email: string;
  comment: string;
};

const EMPTY_FIELDS: BookingFields = {
  name: "",
  email: "",
  comment: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields: BookingFields): FieldErrors {
  const errors: FieldErrors = {};
  const nameParts = fields.name.trim().split(/\s+/).filter(Boolean);

  if (nameParts.length < 2) {
    errors.name = "Please enter your full name.";
  }

  if (!fields.email.trim() || !EMAIL_PATTERN.test(fields.email.trim())) {
    errors.email = "Please enter your email.";
  }

  return errors;
}

function toPayload(fields: BookingFields): BookingPayload {
  const comment = fields.comment.trim();

  return {
    name: fields.name.trim(),
    email: fields.email.trim(),
    ...(comment ? { comment } : {}),
  };
}

export function BookingForm({ carId }: BookingFormProps) {
  const [fields, setFields] = useState<BookingFields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [successMessage, setSuccessMessage] = useState("");

  const mutation = useMutation({
    mutationFn: (payload: BookingPayload) => createBooking(carId, payload),
    onSuccess: (data) => {
      setSuccessMessage(data.message);
      setFields(EMPTY_FIELDS);
      setErrors({});
    },
  });

  function onFieldChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    if (name !== "name" && name !== "email" && name !== "comment") {
      return;
    }

    setFields((current) => ({ ...current, [name]: value }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mutation.isPending) {
      return;
    }

    const nextErrors = validate(fields);
    setErrors(nextErrors);
    setSuccessMessage("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    mutation.mutate(toPayload(fields));
  }

  const requestError =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error
        ? "Could not send your booking request. Please try again."
        : "";

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.heading}>
        <h2>Book your car now</h2>
        <p>Stay connected! We are always ready to help you.</p>
      </div>

      {successMessage ? (
        <p className={styles.success} role="status">
          <Icon name="check" />
          <span>{successMessage}</span>
        </p>
      ) : null}

      <div className={styles.fields}>
        <div className={errors.name ? styles.fieldError : styles.field}>
          <label htmlFor="booking-name">
            {errors.name ? <span className={styles.float}>Name*</span> : null}
            <input
              id="booking-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder={errors.name ? "" : "Name*"}
              value={fields.name}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "booking-name-error" : undefined}
              onChange={onFieldChange}
            />
            {errors.name ? <Icon name="error" size={24} /> : null}
          </label>
          {errors.name ? (
            <p id="booking-name-error" className={styles.errorText}>
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className={errors.email ? styles.fieldError : styles.field}>
          <label htmlFor="booking-email">
            {errors.email ? <span className={styles.float}>Email*</span> : null}
            <input
              id="booking-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={errors.email ? "" : "Email*"}
              value={fields.email}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "booking-email-error" : undefined}
              onChange={onFieldChange}
            />
            {errors.email ? <Icon name="error" size={24} /> : null}
          </label>
          {errors.email ? (
            <p id="booking-email-error" className={styles.errorText}>
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="booking-comment" className={styles.srOnly}>
            Comment
          </label>
          <textarea
            id="booking-comment"
            name="comment"
            placeholder="Comment"
            value={fields.comment}
            rows={3}
            onChange={onFieldChange}
          />
        </div>
      </div>

      {requestError ? (
        <p className={styles.requestError} role="alert">
          {requestError}
        </p>
      ) : null}

      <button
        type="submit"
        className={styles.submit}
        disabled={mutation.isPending}
        aria-busy={mutation.isPending}
      >
        {mutation.isPending ? <Spinner /> : null}
        {mutation.isPending ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
