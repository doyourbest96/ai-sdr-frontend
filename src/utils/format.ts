import { format, register } from "timeago.js";
import * as en from "timeago.js/lib/lang/en_US";
import { parsePhoneNumberWithError } from "libphonenumber-js";

export function formatNumber(value: number, showPlus: boolean = true): string {
  if (value >= 1000000) {
    return `${showPlus && value > 0 ? "+" : ""} ${(value / 1000000).toFixed(
      1
    )}M`;
  }
  if (value >= 1000) {
    return `${showPlus && value > 0 ? "+" : ""} ${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

export function formatPercentage(
  value: number,
  showPlus: boolean = true
): string {
  return `${showPlus && value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function formatNumberWithComma(number: number): string {
  return number.toLocaleString("en-US");
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
  };
  return date.toLocaleDateString("en-US", options).replace(",", "");
}

export function formatDateOrTime(inDate: string | Date): string {
  const date = new Date(inDate);
  const now = new Date();

  // Check if the date is today
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) {
    // Format time if it's today
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleTimeString("en-US", options);
  } else {
    // Format date if it's not today
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "2-digit",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options).replace(",", "");
  }
}

export function formatDateToLocalISOString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function getUserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function convertUtcToLocal(
  utcDateString: string,
  timeZone: string
): string {
  const utcDate: Date = new Date(utcDateString);

  // Use toLocaleString to convert to local time based on the user's time zone
  return utcDate.toLocaleString("en-US", {
    timeZone: timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Set to true for 12-hour format
  });
}

export function formatDateTimeReadable(dateTime: Date | string) {
  if (typeof dateTime === "string") {
    dateTime = new Date(dateTime);
  }

  if (dateTime === null) {
    return "";
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const year = dateTime.getFullYear();
  const month = months[dateTime.getMonth()];
  const day = days[dateTime.getDay()];
  const date = dateTime.getDate();

  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;

  return `${day}, ${month} ${date}, ${year}, at ${hour}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;
}

export const getFormettedInterval = (interval: number | undefined) => {
  if (!interval) return "Deliver email now";

  const days = Math.floor(interval / 1440);
  const hours = Math.floor((interval % 1440) / 60);
  const mins = interval % 60;

  const parts = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (mins > 0) parts.push(`${mins} minute${mins !== 1 ? "s" : ""}`);

  return "Deliver email in " + parts.join(", ") || "0 minutes";
};

export function getInitials(fullName: string, maxLength: number = 2): string {
  return fullName
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join("")
    .slice(0, maxLength);
}

export function getFormattedAddress(
  city: string | undefined,
  state: string | undefined,
  country: string | undefined
): string {
  if (city && state && country) {
    return `${city}, ${state}, ${country}`;
  } else if (city && state) {
    return `${city}, ${state}`;
  } else if (city && country) {
    return `${city}, ${country}`;
  } else if (state && country) {
    return `${state}, ${country}`;
  } else if (city) {
    return city;
  } else if (state) {
    return state;
  } else if (country) {
    return country;
  }
  return "";
}

export const getRelativeTime = (dateString: string): string => {
  register("en_US", en.default);
  return format(new Date(dateString + "Z"), "en_US");
};

export const stripHtmlTags = (html: string) => {
  const decodedHtml = html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'");
  const doc = new DOMParser().parseFromString(decodedHtml, "text/html");
  return doc.body.textContent || "";
};

export const formatTimestamp = (timestamp: number | string): string => {
  const value = typeof timestamp === "string" ? parseInt(timestamp) : timestamp;

  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};

export const formatToE164 = (phoneNumber: string): string | null => {
  try {
    // Remove white space and brackets
    const cleanedNumber = phoneNumber.replace(/\s+|\(|\)/g, "");
    // Parse without region restriction
    const parsedNumber = parsePhoneNumberWithError(cleanedNumber);

    if (!parsedNumber || !parsedNumber.isValid()) {
      return null;
    }

    return parsedNumber.format("E.164");
  } catch (error) {
    console.error("Phone number parsing error:", error);
    return null;
  }
};

export const formatSecondsToTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};
