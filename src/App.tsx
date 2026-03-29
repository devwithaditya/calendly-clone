import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import Meetings from "./pages/Meetings";
import Availability from "./pages/Availability";
import CreateEvent from "./pages/CreateEvent";
import BookingPage from "./pages/BookingPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public booking page - no sidebar */}
          <Route path="/book/:slug" element={<BookingPage />} />

          {/* Dashboard pages with sidebar */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/availability" element={<Availability />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/contacts" element={<PlaceholderPage title="Contacts" />} />
            <Route path="/workflows" element={<PlaceholderPage title="Workflows" />} />
            <Route path="/integrations" element={<PlaceholderPage title="Integrations & Apps" />} />
            <Route path="/analytics" element={<PlaceholderPage title="Analytics" />} />
            <Route path="/admin" element={<PlaceholderPage title="Admin Center" />} />
            <Route path="/help" element={<PlaceholderPage title="Help" />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;