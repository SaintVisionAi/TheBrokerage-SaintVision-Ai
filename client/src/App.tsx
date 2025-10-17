import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SaintBrokerEnhanced from "@/components/ai/saint-broker-enhanced";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import About from "@/pages/about";
import Apply from "@/pages/apply";
import Contact from "@/pages/contact";
import WarRoom from "@/pages/warroom";
import Enterprise from "@/pages/enterprise";
import API from "@/pages/api";
import Careers from "@/pages/careers";
import Blog from "@/pages/blog";
import Documentation from "@/pages/docs";
import HelpCenter from "@/pages/help";
import Community from "@/pages/community";
import Status from "@/pages/status";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Cookies from "@/pages/cookies";
import Patent from "@/pages/patent";
import ADA from "@/pages/ada";
import RealEstate from "@/pages/real-estate";
import Lending from "@/pages/lending";
import Investments from "@/pages/investments";
import CommercialProducts from "@/pages/commercial-products";
import ClientPortal from "@/pages/client-portal";
import REBrokerageIntakePage from "@/pages/re-brokerage-intake";
import REFinanceIntakePage from "@/pages/re-finance-intake";
import AgreementPreviewPage from "@/pages/agreement-preview";
import UploadPortal from "@/pages/upload-portal";
import ApplicationCompletePage from "@/pages/application-complete";
import SaintBookDashboard from "@/pages/admin/saintbook-dashboard";
import QuickContactsPage from "@/pages/admin/quick-contacts";
import NotFound from "@/pages/not-found";

function ProtectedDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (user?.role !== "admin" && user?.role !== "broker") {
    return <Redirect to="/client-portal" />;
  }

  return <Dashboard />;
}

function ProtectedClientPortal() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <ClientPortal />;
}

function ProtectedAdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (user?.role !== "admin" && user?.role !== "broker") {
    return <Redirect to="/client-portal" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/dashboard" component={ProtectedDashboard} />
      <Route path="/client-portal" component={ProtectedClientPortal} />
      <Route path="/admin/saintbook">
        {() => <ProtectedAdminRoute component={SaintBookDashboard} />}
      </Route>
      <Route path="/admin/contacts">
        {() => <ProtectedAdminRoute component={QuickContactsPage} />}
      </Route>
      <Route path="/about" component={About} />
      <Route path="/apply" component={Apply} />
      <Route path="/application-complete" component={ApplicationCompletePage} />
      <Route path="/contact" component={Contact} />
      <Route path="/real-estate" component={RealEstate} />
      <Route path="/real-estate/brokerage-intake" component={REBrokerageIntakePage} />
      <Route path="/real-estate/finance-intake" component={REFinanceIntakePage} />
      <Route path="/real-estate/agreement-preview" component={AgreementPreviewPage} />
      <Route path="/lending" component={Lending} />
      <Route path="/investments" component={Investments} />
      <Route path="/commercial-products" component={CommercialProducts} />
      <Route path="/upload/:token" component={UploadPortal} />
      <Route path="/warroom" component={WarRoom} />
      <Route path="/enterprise" component={Enterprise} />
      <Route path="/api" component={API} />
      <Route path="/careers" component={Careers} />
      <Route path="/blog" component={Blog} />
      <Route path="/docs" component={Documentation} />
      <Route path="/help" component={HelpCenter} />
      <Route path="/community" component={Community} />
      <Route path="/status" component={Status} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/cookies" component={Cookies} />
      <Route path="/patent" component={Patent} />
      <Route path="/ada" component={ADA} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <SaintBrokerEnhanced />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
