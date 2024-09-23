import { useEffect } from "react";
import moment from 'moment-hijri';

export const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

export const getInitial = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase();
};

export const getGregorianDate = () => {
  const date = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export const getHijriDate = () => {
  return moment().format('iMMMM iD, iYYYY');
};
