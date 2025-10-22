import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { SaintBrokerProvider } from "@/context/SaintBrokerContext";
import SaintBrokerGlobal from "@/components/ai/saintbroker-global";
import { useSaintBroker } from "@/context/SaintBrokerContext";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import VerifyEmail from "@/pages/verify-email";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import About from "@/pages/about";
import Apply from "@/pages/apply";
import Contact from "@/pages/contact";
import Status from "@/pages/status";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Cookies from "@/pages/cookies";
import RealEstate from "@/pages/real-estate";
import Lending from "@/pages/lending";
import Investments from "@/pages/investments";
import ClientHub from "@/pages/client-hub";
import REBrokerageIntakePage from "@/pages/re-brokerage-intake";
import REFinanceIntakePage from "@/pages/re-finance-intake";
import AgreementPreviewPage from "@/pages/agreement-preview";
import UploadPortal from "@/pages/upload-portal";
import ApplicationCompletePage from "@/pages/application-complete";
import SaintBookDashboard from "@/pages/admin/saintbook-dashboard";
import QuickContactsPage from "@/pages/admin/quick-contacts";
import SetAppointmentPage from "@/pages/set-appointment";
import PrequalSuccessPage from "@/pages/prequal-success";
import LoansDocs4FundingPage from "@/pages/loans-docs-4-funding";
import RealEstateInvestingPage from "@/pages/real-estate-investing";
import InvestmentOffering1Page from "@/pages/investment-offering-1";
import ComprehensiveSolutionsPage from "@/pages/comprehensive-solutions";
import FileHubPage from "@/pages/file-hub";
import UploadDocumentsPage from "@/pages/upload-documents";
import FullLendingApplicationPage from "@/pages/full-lending-application-1";
import SoftCreditPullPage from "@/pages/soft-credit-pull";
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
    return <Redirect to="/client-hub" />;
  }

  return <Dashboard />;
}

function ProtectedClientHub() {
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

  return <ClientHub />;
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
    return <Redirect to="/client-hub" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/verify-email/:token" component={VerifyEmail} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password/:token" component={ResetPassword} />
      <Route path="/dashboard" component={ProtectedDashboard} />
      <Route path="/admin" component={ProtectedDashboard} />
      <Route path="/client-hub" component={ProtectedClientHub} />
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
      <Route path="/upload/:token" component={UploadPortal} />
      <Route path="/status" component={Status} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/cookies" component={Cookies} />
      <Route path="/set-appointment" component={SetAppointmentPage} />
      <Route path="/prequal-success" component={PrequalSuccessPage} />
      <Route path="/loans-docs-4-funding" component={LoansDocs4FundingPage} />
      <Route path="/real-estate-investing" component={RealEstateInvestingPage} />
      <Route path="/investment-offering-1" component={InvestmentOffering1Page} />
      <Route path="/comprehensive-solutions" component={ComprehensiveSolutionsPage} />
      <Route path="/file-hub" component={FileHubPage} />
      <Route path="/upload-documents" component={UploadDocumentsPage} />
      <Route path="/full-lending-application-1" component={FullLendingApplicationPage} />
      <Route path="/soft-credit-pull" component={SoftCreditPullPage} />
      <Route path="/m/account" component={ProtectedClientHub} />
      <Route component={NotFound} />
    </Switch>
  );
}

function FloatingButton() {
  const { isOpen, openChat } = useSaintBroker();

  if (isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Pulsing glow ring */}
      <div className="absolute inset-0 rounded-full bg-yellow-400/30 blur-xl animate-pulse" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/40 to-yellow-600/40 animate-ping" />

      <button
        onClick={openChat}
        className="relative h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-500 shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-110 border-2 border-yellow-300/50 flex items-center justify-center"
        data-testid="button-floating-saintbroker"
        title="Chat with SaintBroker"
      >
        <svg
          className="h-7 w-7 text-charcoal-900 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </button>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SaintBrokerProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          <FloatingButton />
          <SaintBrokerGlobal />
        </TooltipProvider>
      </SaintBrokerProvider>
    </QueryClientProvider>
  );
}

export default App;
