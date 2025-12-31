import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import TwoFactorPage from "@/pages/auth/TwoFactorPage";
import TwoFactorSetup from "@/pages/auth/TwoFactorSetupPage";
import SocialCallback from "@/pages/auth/SocialCallback";

// Layouts
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AgentLayout } from "@/components/layout/AgentLayout";

// Dashboards
import DashboardPage from "@/pages/dashboard/DashboardPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminAnalyticsDashboardPage from "@/pages/admin/AdminAnalyticsDashboardPage";

// Admin Pages
import AdminProfilePage from "@/pages/admin/profile/AdminProfilePage";
import ViewProfilePage from "@/pages/admin/profile/ViewProfilePage";
import AgentList from "@/pages/admin/agents/AgentList";
import AddAgent from "@/pages/admin/agents/AddAgent";
import AgentProfilePage from "@/pages/admin/agents/AgentProfile";
import AgentViewProfilePage from "@/pages/admin/agents/profile/AgentViewProfilePage";
import AgenteditProfilePage from "@/pages/admin/agents/profile/AgentProfilePage";
import CustomerList from "@/pages/admin/customer/CustomerList";
import AddCustomer from "@/pages/admin/customer/AddCustomer";
import CustomerProfilePage from "@/pages/admin/customer/CustomerProfilePage";
import AddProperties from "@/pages/admin/agents/AddProperties";
import AgentProperty from "@/pages/admin/agents/AgentProperty";
import CustomerPropertyList from "@/pages/admin/customer/CustomerPropertyList";
import AgentTransaction from "@/pages/admin/transaction/AgentTransaction";
import CustomerTransaction from "@/pages/admin/customer/CustomerTransaction";
import OrdersPage from "@/pages/admin/orders/OrdersPage";
import InboxPage from "@/pages/admin/inbox/InboxPage";
import ChatPage from "@/pages/admin/chat/ChatPage";
import ReviewsPage from "@/pages/admin/reviews/ReviewsPage";
import SettingsPage from "@/pages/admin/settings/SettingsPage";
import AgentDashboardPage from "./pages/admin/agents/AgentDashboardPage";
import SubscriptionPlanList from "./pages/admin/subscriptions/SubscriptionPlanList";
import AddSubscriptionPlan from "./pages/admin/subscriptions/AddSubscripitonPlan";
import EditSubscriptionPlan from "./pages/admin/subscriptions/EditSubscriptionPlan";
import Credit from "./pages/admin/Creditwallet/credit";
import Wallet from "./pages/admin/Creditwallet/wallet";

// Property Pages
import AddProperty from "@/pages/admin/agents/property/AddProperty";
import EditProperty from "@/pages/admin/agents/property/EditProperty";
import PropertyList from "@/pages/admin/agents/property/PropertyList";
import ViewProperty from "@/pages/admin/agents/property/ViewProperty";
import PropertyListAdmin from "@/pages/admin/property/PropertyList";
import PropertyStatsAdmin from "@/pages/admin/property/PropertyStats";
import SingleProperty from "@/components/sections/home/SingleProperty";

// Leads
import LeadList from "@/pages/admin/agents/lead/LeadList";
import ViewLead from "@/pages/admin/agents/lead/ViewLead";

// Customer Pages
import CustomerLayout from "@/pages/customer/CustomerLayout";
import CustomerProfile from "@/pages/customer/CustomerProfile";
import ProfileEditForm from "@/pages/customer/ProfileEditForm";
import PropertyFilters from "@/pages/customer/PropertyFilters";
import PropertyView from "@/pages/customer/PropertyView";
import ContactPage from "@/pages/customer/ContactPage";
import Creditwallate from "@/pages/customer/Creditwallate/mywallet";
import PackagePlan from "@/pages/customer/Creditwallate/packagepage";
import AIHub from "@/pages/customer/AIHub";

// Routing Utils
import ProtectedRoute from "@/lib/ProtectedRoute";
import PublicRoute from "@/lib/PublicRoute";
import { ApiInterceptor } from "./api/ApiInterceptor";
import ScrollToTop from "@/components/ScrollToTop";
import FloatingAIChatWrapper from "@/components/ai/FloatingAIChatWrapper";
import AgentAppointments from "./pages/admin/agents/appointment/AgentAppointments";
import ShowSubscriptionPlan from "./pages/admin/subscriptions/ShowSubscriptionPlan";
import SubscriptionPlans from "./pages/customer/subscriptions/SubscriptionPlans";
import StripeProvider from "./providers/StripeProvider";
import SubscriptionCheckout from "./pages/customer/subscriptions/SubscriptionCheckout";
import MySubscriptions from "./pages/customer/subscriptions/MySubscriptions";
import RemindersList from "./pages/admin/agents/reminders/RemindersList";
import CreateReminder from "./pages/admin/agents/reminders/CreateReminder";
import EditReminder from "./pages/admin/agents/reminders/EditReminder";
import ShowReminder from "./pages/admin/agents/reminders/ShowReminder";
import CustomerChatPage from "./pages/customer/CustomerChatPage";
import PagesList from './pages/admin/pages/PagesList';
import PageEditor from './pages/admin/pages/PageEditor';
import FAQList from "./pages/admin/cms/faqs/FAQList";
import BlogList from "./pages/admin/cms/blogs/BlogList";
import AgentBlogList from "./pages/admin/agents/cms/Bloglist";
import AgentcommentList from "./pages/admin/agents/cms/Commentslist";
import NewsList from "./pages/admin/cms/news/NewsList";
import BlogCategories from "./pages/admin/cms/blogs/BlogCategories";
import BlogPage from "./pages/customer/Blog/BlogPage";
import SingleBlogPage from "./pages/customer/Blog/SingleBlog";
import Aipriceestimate from "./pages/admin/agents/aipriceestimate/Aipriceestimate";
import AIChatLeadsDashboard from "./pages/admin/aichatleads/AIChatLeads";
import PageView from './pages/customer/PageView';

function App() {
  return (
    <BrowserRouter>
      <StripeProvider>
        <ScrollToTop />
        <ApiInterceptor />
        <Routes>
          {/* ---------------- AUTH ROUTES ---------------- */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignupPage />} />
            <Route path="/two-factor" element={<TwoFactorPage />} />
            <Route path="/two-factor-setup" element={<TwoFactorSetup />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/social-callback" element={<SocialCallback />} />
          </Route>

          {/* ---------------- USER DASHBOARD ---------------- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* ---------------- CUSTOMER ROUTES ---------------- */}
          <Route element={<CustomerLayout />}>
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <CustomerProfile />
                </ProtectedRoute>
              }
            />
            {/* Customer Chat */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <CustomerChatPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <ProfileEditForm />
                </ProtectedRoute>
              }
            />

            {/* Property Listing */}
            <Route path="/properties/rent" element={<PropertyFilters />} />
            <Route path="/properties/sale" element={<PropertyFilters />} />
            <Route path="/properties/view/:id" element={<PropertyView />} />

            {/* Contact Page */}
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/package-plan" element={<PackagePlan />} />
            <Route path="/my-wallet" element={<Creditwallate />} />
            {/* AI Features */}
            <Route path="/ai-hub" element={<AIHub />} />

            {/* Subscriptions */}
            <Route
              path="/subscription-plans"
              element={
                <ProtectedRoute>
                  <SubscriptionPlans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscription-plan/checkout/:planId"
              element={
                <ProtectedRoute>
                  <SubscriptionCheckout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-subscriptions"
              element={
                <ProtectedRoute>
                  <MySubscriptions />
                </ProtectedRoute>
              }
            />
            {/* Blog Page */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<SingleBlogPage />} />

            <Route path="/page/:slug" element={<PageView />} />
            {/* Customer Protected Route */}
          </Route>

          {/* ---------------- ADMIN ROUTES WITH LAYOUT ---------------- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="analytics" element={<AdminAnalyticsDashboardPage />} />

            {/* Profile */}
            <Route path="profile" element={<ViewProfilePage />} />
            <Route path="profile/edit" element={<AdminProfilePage />} />

            {/* Agents */}
            <Route path="agents" element={<AgentList />} />
            <Route path="agents/new" element={<AddAgent />} />
            <Route path="agents/:id" element={<AgentProfilePage />} />
            <Route path="agents/:id/properties" element={<AgentProperty />} />
            <Route path="agents/:id/properties/new" element={<AddProperties />} />

            {/* Customers */}
            <Route path="customers" element={<CustomerList />} />
            <Route path="customers/new" element={<AddCustomer />} />
            <Route path="customers/:id" element={<CustomerProfilePage />} />
            <Route path="customers/:id/properties" element={<CustomerPropertyList />} />
            <Route path="customers/:id/transactions" element={<CustomerTransaction />} />

            {/* Subscriptions */}
            <Route path="subscriptions" element={<SubscriptionPlanList />} />
            <Route path="subscriptions/new" element={<AddSubscriptionPlan />} />
            <Route path="subscriptions/:id" element={<ShowSubscriptionPlan />} />
            <Route path="subscriptions/:id/edit" element={<EditSubscriptionPlan />} />

            {/* Credit & Wallet */}
            <Route path="credit" element={<Credit />} />
            <Route path="wallet" element={<Wallet />} />

            {/* Properties */}
            <Route path="properties" element={<PropertyListAdmin />} />
            <Route path="properties/stats" element={<PropertyStatsAdmin />} />

            {/* CMS */}
            <Route path="cms/faqs" element={<FAQList />} />
            <Route path="cms/blog-categories" element={<BlogCategories />} />
            <Route path="cms/blogs" element={<BlogList />} />
            <Route path="cms/news" element={<NewsList />} />

            {/* Pages */}
            <Route path="pages" element={<PagesList />} />
            <Route path="pages/create" element={<PageEditor />} />
            <Route path="pages/edit/:id" element={<PageEditor />} />

            {/* Transactions */}
            <Route path="transactions/agents" element={<AgentTransaction />} />
            <Route path="transactions/customers" element={<CustomerTransaction />} />
            <Route path="aichatleads" element={<AIChatLeadsDashboard />} />

            {/* Orders, Inbox, Chat, Reviews, Settings */}
            <Route path="orders" element={<OrdersPage />} />
            <Route path="inbox" element={<InboxPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* ---------------- AGENT ROUTES WITH LAYOUT ---------------- */}
          <Route
            path="/agent"
            element={
              <ProtectedRoute allowedRoles={["agent", "admin"]}>
                <AgentLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route path="dashboard" element={<AgentDashboardPage />} />

            {/* Profile */}
            <Route path="profile" element={<AgentViewProfilePage />} />
            <Route path="profile/edit" element={<AgenteditProfilePage />} />

            {/* Properties */}
            <Route path="properties" element={<PropertyList />} />
            <Route path="properties/new" element={<AddProperty />} />
            <Route path="properties/:id" element={<ViewProperty />} />
            <Route path="properties/:id/edit" element={<EditProperty />} />

            {/* Leads */}
            <Route path="leads" element={<LeadList />} />
            <Route path="leads/:id" element={<ViewLead />} />

            {/* AI Tools */}
            <Route path="ai-price-estimate" element={<Aipriceestimate />} />

            {/* Reminders */}
            <Route path="reminders" element={<RemindersList />} />
            <Route path="reminders/:id" element={<ShowReminder />} />
            <Route path="reminders/new" element={<CreateReminder />} />
            <Route path="reminders/:id/edit" element={<EditReminder />} />

            {/* Appointments */}
            <Route path="appointments" element={<AgentAppointments />} />

            {/* Chat */}
            <Route path="chat" element={<ChatPage />} />

            {/* Blogs */}
            <Route path="blogs" element={<AgentBlogList />} />
            <Route path="comments" element={<AgentcommentList />} />

            {/* Subscriptions */}
            <Route path="subscription-plans" element={<SubscriptionPlans />} />
            <Route path="subscription-plan/checkout/:planId" element={<SubscriptionCheckout />} />
            <Route path="my-subscriptions" element={<MySubscriptions />} />
          </Route>

          {/* ---------------- PUBLIC PROPERTY VIEW ---------------- */}
          <Route path="/property/:id" element={<SingleProperty />} />
        </Routes>

        {/* Global Toast Notifications */}
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontSize: "15px" },
          }}
        />

        {/* Floating AI Chat Button - Only Public view - Guest + Auth */}
        <FloatingAIChatWrapper />
      </StripeProvider>
    </BrowserRouter>
  );
}

export default App;
