import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Testimonials & Verified Reviews - MobiQ",
  description: "Check out real client stories and video testimonials on MobiQ. See why we are the trusted second hand marketplace in Karnataka for buying and selling used phones and electronics.",
};

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
