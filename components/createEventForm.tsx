"use client";
import * as React from "react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { eventformSchema } from "@/lib/validations/validation";
import { createEvent } from "@/lib/helpers/event-helpers";
import { createClient } from "@/utils/supabase/client";

export function CreateEventForm({
  modalOpen,
  setModalOpen,
}: {
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof eventformSchema>>({
    resolver: zodResolver(eventformSchema),
    defaultValues: {
      eventname: "",
      eventdescription: "",
      eventcategory: "Sports",
      eventdate: new Date(),
      eventtime: "10:30:00",
      eventtickets: "0",
      eventlocation: "",
    },
  });

  async function onSubmit(values: z.infer<typeof eventformSchema>) {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.getUser();
    if (error) console.log(error);

    await createEvent(values);
    setLoading(false);

    setModalOpen(false);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* EVENT NAME */}
        <FormField
          control={form.control}
          name="eventname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Summer Music Fest"
                  {...field}
                  className="focus-visible:border-orange-300 focus-visible:ring-orange-300 bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DESCRIPTION */}
        <FormField
          control={form.control}
          name="eventdescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the event description"
                  {...field}
                  className="focus-visible:border-orange-300 focus-visible:ring-orange-300 bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="eventlocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the event location"
                  {...field}
                  className="focus-visible:border-orange-300 focus-visible:ring-orange-300 bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventtickets"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Tickets</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the amount of Tickets available"
                  {...field}
                  className="focus-visible:border-orange-300 focus-visible:ring-orange-300 bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CATEGORY SELECT */}
        <FormField
          control={form.control}
          name="eventcategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Category</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DATE PICKER */}
        <FormField
          control={form.control}
          name="eventdate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-40 justify-between font-normal"
                  >
                    {field.value
                      ? field.value.toLocaleDateString()
                      : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TIME PICKER */}
        <FormField
          name="eventtime"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  step="1"
                  className="bg-background"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SUBMIT */}
        <Button
          type="submit"
          className="w-full bg-linear-to-r from-red-500 via-orange-400 to-yellow-300"
        >
          {loading ? "Creating..." : "Create Event"}
        </Button>
      </form>
    </Form>
  );
}
// made the table and inputed some rls to it you were also makeing a server helper function for updating the table
