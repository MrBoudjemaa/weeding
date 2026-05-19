import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const schema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(120, "Name is too long"),
  attending: z.enum(["yes", "no"], { required_error: "Please let us know" }),
  guest_count: z.coerce.number().int().min(0).max(20).optional(),
  message: z.string().trim().max(1000, "Message is too long").optional(),
});

type FormValues = z.infer<typeof schema>;

export function RsvpDialog() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { guest_count: 1, message: "" },
  });

  const attending = watch("attending");

  const onSubmit = async (values: FormValues) => {
    const { error } = await supabase.from("rsvps").insert({
      full_name: values.full_name,
      attending: values.attending === "yes",
      guest_count: values.attending === "yes" ? values.guest_count ?? 1 : 0,
      message: values.message?.length ? values.message : null,
    });

    if (error) {
      toast.error("Couldn't send your RSVP", { description: error.message });
      return;
    }

    toast.success("Thank you!", {
      description:
        values.attending === "yes"
          ? "We can't wait to celebrate with you."
          : "We'll miss you on our special day.",
    });
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="rsvp_btn">
          <span>RSVP</span>
        </button>
      </DialogTrigger>
      <DialogContent className="rsvp_dialog">
        <DialogHeader>
          <DialogTitle className="rsvp_dialog_title">Kindly RSVP</DialogTitle>
          <DialogDescription className="rsvp_dialog_desc">
            We'd love to know if you'll be joining us on 12. 10. 2026
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="rsvp_form">
          <div className="rsvp_field">
            <label htmlFor="full_name">Full name</label>
            <input
              id="full_name"
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              maxLength={120}
              {...register("full_name")}
            />
            {errors.full_name && (
              <p className="rsvp_error">{errors.full_name.message}</p>
            )}
          </div>

          <div className="rsvp_field">
            <label>Will you attend?</label>
            <div className="rsvp_choice_group">
              <button
                type="button"
                className={`rsvp_choice ${attending === "yes" ? "is-active" : ""}`}
                onClick={() => setValue("attending", "yes", { shouldValidate: true })}
              >
                Yes, joyfully
              </button>
              <button
                type="button"
                className={`rsvp_choice ${attending === "no" ? "is-active" : ""}`}
                onClick={() => setValue("attending", "no", { shouldValidate: true })}
              >
                Sadly, no
              </button>
            </div>
            {errors.attending && (
              <p className="rsvp_error">{errors.attending.message}</p>
            )}
          </div>

          {attending === "yes" && (
            <div className="rsvp_field">
              <label htmlFor="guest_count">How many guests are you bringing?</label>
              <input
                id="guest_count"
                type="number"
                min={0}
                max={20}
                {...register("guest_count")}
              />
              {errors.guest_count && (
                <p className="rsvp_error">{errors.guest_count.message}</p>
              )}
            </div>
          )}

          <div className="rsvp_field">
            <label htmlFor="message">Message or note</label>
            <textarea
              id="message"
              rows={3}
              maxLength={1000}
              placeholder="A note for the couple…"
              {...register("message")}
            />
            {errors.message && (
              <p className="rsvp_error">{errors.message.message}</p>
            )}
          </div>

          <button type="submit" className="rsvp_btn rsvp_submit" disabled={isSubmitting}>
            <span>{isSubmitting ? "Sending…" : "Send RSVP"}</span>
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
