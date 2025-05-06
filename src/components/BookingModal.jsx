import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';

const BookingModal = ({ tutor, onClose, userId, navigate }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [availableDays, setAvailableDays] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    if (tutor && tutor.availableTimes && tutor.availableTimes.length > 0) {
      const days = [...new Set(tutor.availableTimes.map(item => item.day))];
      setAvailableDays(days);
    }
  }, [tutor]);

  useEffect(() => {
    if (selectedDate && tutor && tutor.availableTimes) {
      const timesForDay = tutor.availableTimes
        .filter(item => item.day === selectedDate)
        .map(item => item.time);

      setAvailableTimes(timesForDay);
      setSelectedTime('');
    }
  }, [selectedDate, tutor]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup - remove script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleBookLesson = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const date = getDateFromDay(selectedDate);

      console.log({
        guru: tutor._id,
        student: user._id,
        date: new Date(date),
        time: selectedTime,
        duration: 60,
        price: tutor?.perHourRate,
        status: "pending"
      });

      const response = await fetch(`https://gurukul-backend-21h3.onrender.com/api/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          guru: tutor._id,
          student: user._id,
          date: new Date(date),
          time: selectedTime,
          duration: 60,
          price: tutor.perHourRate,
          status: "pending"
        })
      }).then(res => res.json())

      if (response.error === 0) {
        toast.success("Session booked successfully!");
        onClose(); // Close the modal after successful booking
      }
      else if (response.error === 2) {
        toast.error("Session already booked!");
      }
      else {
        throw new Error("Failed to book session");
      }
    }
    catch (err) {
      console.error("Error booking lesson:", err);
      toast.error("Failed to book a session. Please try again later.");
    }
  }

  const getDateFromDay = (day) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const todayIndex = today.getDay();
    const targetIndex = daysOfWeek.indexOf(day);

    if (targetIndex === -1) {
      throw new Error("Invalid day provided");
    }

    let daysToAdd = targetIndex - todayIndex;
    if (daysToAdd < 0) {
      daysToAdd += 7;
    }

    const targetDate = new Date();
    targetDate.setDate(today.getDate() + daysToAdd);
    return targetDate;
  };

  const openRazorpay = async () => {
    console.log(tutor?.perHourRate)
    setIsLoading(true);
    try {
      const response = await fetch("https://gurukul-backend-21h3.onrender.com/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: tutor?.perHourRate
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const order = await response.json();

      const options = {
        key: "rzp_test_EfZ5xkx1ssjM7g",
        amount: tutor?.perHourRate * 100,
        currency: "INR",
        name: "Guruqool.com",
        description: `Payment student to teacher : ${tutor?.username}`,
        order_id: order.id,
        handler: async function (response) {
          try {

            console.log(response, " [[");
            if (response.razorpay_payment_id != "") {
              toast.success("Payment successful");
              await handleBookLesson();
            } else {
              toast.error("Payment failed");
            }
          } catch (error) {
            console.error("Payment failed error:", error);
            toast.error("Error processing payment");
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: tutor?.username,
          email: tutor?.email,
          contact: tutor?.phone,
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            toast.info("Payment cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Failed to create Razorpay order:", err);
      toast.error("Failed to initiate payment");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full mx-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white font-poppins">
              Book a Session
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  Select Day
                </label>
                <div className="relative">
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 text-gray-800 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-guru-blue dark:focus:ring-blue-500"
                  >
                    <option value="">Select day</option>
                    {availableDays.map((day, idx) => (
                      <option key={idx} value={day}>
                        {getDateFromDay(day).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  Select Time
                </label>
                <div className="relative">
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    disabled={!selectedDate}
                    className={`w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 text-gray-800 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-guru-blue dark:focus:ring-blue-500 ${!selectedDate && 'opacity-60 cursor-not-allowed'}`}
                  >
                    <option value="">Select time</option>
                    {availableTimes.map((time, idx) => (
                      <option key={idx} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400 pointer-events-none" />
                </div>
              </div>

              {tutor && tutor.perHourRate && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300">Session Fee:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">₹{tutor.perHourRate}</span>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <motion.button
                  onClick={openRazorpay}
                  disabled={isLoading || !selectedDate || !selectedTime}
                  className={`btn-primary w-full flex justify-center items-center ${(isLoading || !selectedDate || !selectedTime) && 'opacity-60 cursor-not-allowed'}`}
                  whileHover={!isLoading && selectedDate && selectedTime ? { scale: 1.03 } : {}}
                  whileTap={!isLoading && selectedDate && selectedTime ? { scale: 0.97 } : {}}
                >
                  {isLoading ? 'Processing...' : 'Pay & Book Session'}
                </motion.button>
              </div>

              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                By booking, you agree to the tutor's cancellation policy and payment terms.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;