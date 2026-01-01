/* eslint-disable @typescript-eslint/no-explicit-any */
/* src/pages/agent/AgentViewProfilePage.tsx */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* src/pages/agent/AgentViewProfilePage.tsx */
import { useEffect, useRef, useState } from "react";
import { getProfile } from "@/api/agent/profileApi";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  User,
  Calendar,
  Clock,
  ShieldCheck,
  Home,
  Edit,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

const AgentViewProfilePage = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Prevent duplicate profile fetches (StrictMode or multiple callers)
  const didLoadRef = useRef(false);

  // 2FA state
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorConfirmLoading, setTwoFactorConfirmLoading] = useState(false);
  const [twoFactorDisableLoading, setTwoFactorDisableLoading] = useState(false);
  const [qrData, setQrData] = useState<{ secret?: string; qr_code_url?: string } | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);

  // disable modal
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [disableCode, setDisableCode] = useState("");
  const [disableError, setDisableError] = useState<string | null>(null);

  useEffect(() => {
    if (didLoadRef.current) {
      setLoading(false);
      return;
    }
    if (user) {
      didLoadRef.current = true;
      setLoading(false);
      return;
    }

    didLoadRef.current = true;
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await getProfile();
      const payload = (res as any)?.data ?? res;
      const fetchedUser = payload?.data?.user ?? payload?.data ?? payload;
      setUser(fetchedUser ?? null);
      // persist to localStorage so other code reading localStorage sees the updated user
      if (fetchedUser) localStorage.setItem("user", JSON.stringify(fetchedUser));
    } catch (err) {
      console.error("Failed to load profile:", err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // helpers to interpret messages (some backends respond with human messages)
  const messageIndicatesAlreadyEnabled = (msg?: string | null) => {
    if (!msg) return false;
    return /already enabled/i.test(msg);
  };
  const messageIndicatesAlreadyDisabled = (msg?: string | null) => {
    if (!msg) return false;
    return /already disabled|not enabled|2fa is not enabled/i.test(msg);
  };

  // Start setup: request QR/secret from server
  const startTwoFactorSetup = async () => {
    setTwoFactorError(null);
    setTwoFactorLoading(true);
    try {
      const res = await api.post<{
        success?: boolean;
        data?: { secret?: string; qr_code_url?: string };
        message?: string;
      }>("/2fa/setup");
      const data = (res as any)?.data ?? res;

      // If backend says already enabled, reflect that immediately
      if (data && (data.success === false || data.success === 0) && messageIndicatesAlreadyEnabled(data.message)) {
        const newUser = { ...(user as any), ['2fa_enabled']: true };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        toast.success("Two-factor is already enabled");
        return;
      }

      const payload = data?.data ?? data;
      const normalized = {
        secret: payload?.secret ?? payload?.otp_secret,
        qr_code_url: payload?.qr_code_url ?? payload?.qrcode ?? payload?.qr,
      };
      setQrData(normalized);
      setOtpCode("");
      setTwoFactorModalOpen(true);
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message ?? err?.message;
      if (messageIndicatesAlreadyEnabled(serverMsg)) {
        const newUser = { ...(user as any), ['2fa_enabled']: true };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        toast.success("Two-factor is already enabled");
      } else {
        console.error("generateTwoFactorSetup failed", err);
        setTwoFactorError(serverMsg ?? "Failed to generate 2FA QR code");
        toast.error("Failed to generate QR code for two-factor setup");
      }
    } finally {
      setTwoFactorLoading(false);
    }
  };

  // Confirm enabling: send OTP to backend
  const confirmEnableTwoFactor = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setTwoFactorError("Please enter the 6-digit code from your authenticator app.");
      return;
    }
    setTwoFactorConfirmLoading(true);
    setTwoFactorError(null);
    try {
      const res = await api.post<{ success?: boolean; data?: { user?: any }; message?: string }>(
        "/2fa/enable",
        { code: otpCode }
      );
      const data = (res as any)?.data ?? res;

      if (data && (data.success === false || data.success === 0) && messageIndicatesAlreadyEnabled(data.message)) {
        const newUser = { ...(user as any), ['2fa_enabled']: true };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        setTwoFactorModalOpen(false);
        setQrData(null);
        setOtpCode("");
        toast.success("Two-factor is already enabled");
        return;
      }

      if (data && data.success === false) {
        const msg = data.message ?? "Invalid code";
        setTwoFactorError(msg);
        toast.error(msg);
        setTwoFactorConfirmLoading(false);
        return;
      }

      // backend might return updated user object
      const returnedUser = data?.data?.user ?? data?.user ?? null;
      if (returnedUser) {
        setUser(returnedUser);
        localStorage.setItem("user", JSON.stringify(returnedUser));
      } else {
        const newUser = { ...(user as any), ['2fa_enabled']: true };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
      }

      setTwoFactorModalOpen(false);
      setQrData(null);
      setOtpCode("");
      toast.success("Two-factor authentication enabled");
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message ?? err?.message;
      if (messageIndicatesAlreadyEnabled(serverMsg)) {
        const newUser = { ...(user as any), ['2fa_enabled']: true };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        setTwoFactorModalOpen(false);
        setQrData(null);
        setOtpCode("");
        toast.success("Two-factor is already enabled");
      } else {
        console.error("enableTwoFactor failed", err);
        const msg = serverMsg ?? "Failed to enable two-factor";
        setTwoFactorError(msg);
        toast.error(msg);
      }
    } finally {
      setTwoFactorConfirmLoading(false);
    }
  };

  // Confirm disable flow
  const confirmDisableTwoFactor = async () => {
    setDisableError(null);

    // many backends require OTP to disable; if not required you can skip validation
    if (!disableCode || disableCode.length !== 6) {
      setDisableError("Please enter the 6-digit code from your authenticator app.");
      return;
    }

    setTwoFactorDisableLoading(true);
    try {
      const res = await api.post<{ success?: boolean; data?: { user?: any }; message?: string }>(
        "/2fa/disable",
        { code: disableCode }
      );
      const data = (res as any)?.data ?? res;

      if (data && (data.success === false || data.success === 0) && messageIndicatesAlreadyDisabled(data.message)) {
        const newUser = { ...(user as any), ['2fa_enabled']: false };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        setShowDisableConfirm(false);
        setDisableCode("");
        toast.warning("Two-factor is already disabled");
        return;
      }

      if (data && data.success === false) {
        const msg = data.message ?? "Failed to disable 2FA";
        setDisableError(msg);
        toast.error(msg);
        setTwoFactorDisableLoading(false);
        return;
      }

      const returnedUser = data?.data?.user ?? data?.user ?? null;
      if (returnedUser) {
        setUser(returnedUser);
        localStorage.setItem("user", JSON.stringify(returnedUser));
      } else {
        const newUser = { ...(user as any), ['2fa_enabled']: false };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
      }

      setShowDisableConfirm(false);
      setDisableCode("");
      toast.success("Two-factor authentication disabled");
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message ?? err?.message;
      setDisableError(serverMsg ?? "Failed to disable two-factor");
      toast.error(serverMsg ?? "Failed to disable two-factor");
    } finally {
      setTwoFactorDisableLoading(false);
    }
  };

  if (loading) {
    return (
    <>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
          </div>
        </div>
    </>
  );
  }

  if (!user) {
    return (
    <>
        <div className="flex items-center justify-center h-[70vh]">
          <p className="text-gray-600">No profile data found.</p>
        </div>
    </>
  );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-xl">
                <User className="text-primary" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-primary">
                  My Profile
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  View your agent information
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 cursor-pointer"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
              <Button
                onClick={() => navigate("/agent/profile/edit")}
                className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg cursor-pointer"
              >
                <Edit size={18} className="mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          {/* Cover & Avatar Section */}
          <div className="relative">
            <div className="h-32 bg-primary"></div>
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  src={user.avatar_url || "/default-avatar.png"}
                  alt="avatar"
                  className="w-32 h-32 rounded-2xl border-4 border-white dark:border-gray-900 shadow-xl object-cover"
                />
                {user.email_verified_at && (
                  <div className="absolute -bottom-2 -right-2 bg-primary-500 rounded-full p-1.5 shadow-lg border-2 border-white dark:border-gray-900">
                    <CheckCircle2 className="text-white" size={16} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            {/* Name and Role */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {user.name}
              </h2>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded-lg text-sm font-semibold capitalize">
                  Agent
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Calendar size={14} />
                  Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                    <Mail className="text-primary" size={18} />
                  </div>
                  Contact Information
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Mail className="text-gray-400 mt-0.5" size={18} />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email Address</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Phone className="text-gray-400 mt-0.5" size={18} />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phone Number</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  {user.address && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Home className="text-gray-400 mt-0.5" size={18} />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Address</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.address}</p>
                      </div>
                    </div>
                  )}

                  {(user.city || user.state) && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <MapPin className="text-gray-400 mt-0.5" size={18} />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.city || "-"}
                          {user.state ? `, ${user.state}` : ""}
                          {user.zipcode ? ` ${user.zipcode}` : ""}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                    <Briefcase className="text-primary" size={18} />
                  </div>
                  Professional Details
                </h3>

                <div className="space-y-3">
                  {user.company_name && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Building2 className="text-gray-400 mt-0.5" size={18} />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Company Name</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.company_name}</p>
                      </div>
                    </div>
                  )}

                  {user.license_number && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Briefcase className="text-gray-400 mt-0.5" size={18} />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">License Number</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.license_number}</p>
                      </div>
                    </div>
                  )}

                  {/* Email Verification */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {user.email_verified_at ? (
                      <ShieldCheck className="text-primary-500 mt-0.5" size={18} />
                    ) : (
                      <AlertCircle className="text-amber-500 mt-0.5" size={18} />
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email Verification</p>
                      <p className={`font-medium ${user.email_verified_at ? "text-primary-600 dark:text-primary-400" : "text-amber-600 dark:text-amber-400"}`}>
                        {user.email_verified_at
                          ? `Verified on ${new Date(user.email_verified_at).toLocaleDateString()}`
                          : "Not Verified"}
                      </p>
                    </div>
                  </div>

                  {/* Two-Factor Toggle */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="rounded-md bg-slate-50 dark:bg-slate-900/30">
                      <ShieldCheck className={`mt-0.5 ${(user as any)['2fa_enabled'] ? "text-primary-600" : "text-red-600"}`} size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Two-Factor Authentication</p>
                          <p className={`font-medium ${(user as any)['2fa_enabled'] ? "text-primary-600 dark:text-primary-400" : "text-red-600 dark:text-white"}`}>
                            {(user as any)['2fa_enabled'] ? "Enabled" : "Disabled"}
                          </p>
                        </div>

                        <div>
                          {(user as any)['2fa_enabled'] ? (
                            <button
                              onClick={() => { setDisableCode(""); setDisableError(null); setShowDisableConfirm(true); }}
                              disabled={twoFactorDisableLoading}
                              className="inline-flex items-center h-8 px-3 rounded-full bg-red-600 dark:bg-red-700 text-white hover:opacity-90 cursor-pointer transition-opacity"
                              title="Disable two-factor authentication"
                            >
                              {twoFactorDisableLoading ? "Disabling..." : "Disable"}
                            </button>
                          ) : (
                            <button
                              onClick={startTwoFactorSetup}
                              disabled={twoFactorLoading}
                              className="inline-flex items-center h-8 px-3 rounded-full bg-primary text-white hover:bg-primary/90 cursor-pointer transition-colors"
                              title="Enable two-factor authentication"
                            >
                              {twoFactorLoading ? "Preparing..." : "Enable"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Last Login */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Clock className="text-gray-400 mt-0.5" size={18} />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Login</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : "No record"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2FA Setup Modal */}
        {twoFactorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => { if (!twoFactorConfirmLoading) { setTwoFactorModalOpen(false); setQrData(null); } }} />
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Enable Two-Factor Authentication</h3>
                <button onClick={() => { if (!twoFactorConfirmLoading) { setTwoFactorModalOpen(false); setQrData(null); } }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.) then enter the 6-digit code below to confirm.</p>

                <div className="flex flex-col items-center gap-2">
                  {qrData?.qr_code_url ? (
                    <QRCodeSVG value={qrData.qr_code_url} size={170} className="bg-white p-2 rounded shadow" />
                  ) : (
                    <div className="w-[170px] h-[170px] bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">QR Loading...</div>
                  )}

                  {qrData?.secret && (
                    <p className="text-xs text-gray-500">Secret: <span className="font-mono text-sm text-gray-700">{qrData.secret}</span></p>
                  )}
                </div>

                {twoFactorError && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{twoFactorError}</p>}

                <form onSubmit={confirmEnableTwoFactor} className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">6-digit code</label>
                    <input
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter 6-digit code"
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    />
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button type="button" onClick={() => { setTwoFactorModalOpen(false); setQrData(null); }} disabled={twoFactorConfirmLoading} className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Cancel</button>
                    <button type="submit" disabled={twoFactorConfirmLoading} className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white transition-colors">
                      {twoFactorConfirmLoading ? "Enabling..." : "Enable 2FA"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Disable confirm modal (requests OTP) */}
        {showDisableConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => { if (!twoFactorDisableLoading) setShowDisableConfirm(false); }} />
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <svg className="w-5 h-5 text-rose-600" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Disable Two-Factor</h3>
                  <p className="text-sm text-gray-600">Enter a 6-digit code from your authenticator app to disable two-factor authentication.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">6-digit code</label>
                  <input
                    value={disableCode}
                    onChange={(e) => { setDisableCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setDisableError(null); }}
                    placeholder="Enter 6-digit code"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                  />
                  {disableError && <p className="text-sm text-red-600 mt-2">{disableError}</p>}
                </div>

                <div className="flex justify-end gap-3">
                  <button onClick={() => { setShowDisableConfirm(false); setDisableCode(""); setDisableError(null); }} disabled={twoFactorDisableLoading} className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={confirmDisableTwoFactor} disabled={twoFactorDisableLoading} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors">
                    {twoFactorDisableLoading ? "Disabling..." : "Disable 2FA"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AgentViewProfilePage;
