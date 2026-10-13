import React, { useState, useEffect } from 'react';
import { User, LkmData } from './types';
import { StorageService, subscribeToStorage } from './services/storage';

// Common Components
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { UserSwitcherModal } from './components/common/UserSwitcherModal';

// Guru Components
import { GuruDashboard } from './components/guru/GuruDashboard';
import { LkmBank } from './components/guru/LkmBank';
import { LkmBuilder } from './components/guru/LkmBuilder';
import { AssignmentManager } from './components/guru/AssignmentManager';
import { GroupManager } from './components/guru/GroupManager';
import { MonitoringPengerjaan } from './components/guru/MonitoringPengerjaan';
import { PenilaianModal } from './components/guru/PenilaianModal';
import { RekapNilai } from './components/guru/RekapNilai';
import { GasIntegrationModal } from './components/guru/GasIntegrationModal';
import { DataMuridKelas } from './components/guru/DataMuridKelas';

// Murid Components
import { MuridDashboard } from './components/murid/MuridDashboard';
import { LkmWorksheet } from './components/murid/LkmWorksheet';
import { RiwayatNilai } from './components/murid/RiwayatNilai';
import { MuridRefleksi } from './components/murid/MuridRefleksi';
import { MuridProfil } from './components/murid/MuridProfil';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';

// Print Component
import { PrintableLkm } from './components/print/PrintableLkm';
import { ToastContainer } from './components/common/ToastContainer';
import { showToast } from './services/toast';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(() => StorageService.getCurrentUser());
  const [currentTab, setCurrentTab] = useState<string>(() => {
    return currentUser.role === 'guru'
      ? 'dashboard'
      : currentUser.role === 'murid'
      ? 'murid_dashboard'
      : 'admin_dashboard';
  });

  // Modal states
  const [userSwitcherOpen, setUserSwitcherOpen] = useState(false);
  const [gasModalOpen, setGasModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active interaction states
  const [editingLkm, setEditingLkm] = useState<LkmData | null>(null);
  const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(null);
  const [printingLkmId, setPrintingLkmId] = useState<string | null>(null);
  const [activeWorksheetAssignmentId, setActiveWorksheetAssignmentId] = useState<string | null>(null);

  // Force re-render on storage updates
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToStorage(() => {
      setTick((t) => t + 1);
    });
    return () => unsubscribe();
  }, []);

  // Update default tab when user switches role
  const handleUserChanged = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'guru') {
      setCurrentTab('dashboard');
    } else if (user.role === 'murid') {
      setCurrentTab('murid_dashboard');
    } else {
      setCurrentTab('admin_dashboard');
    }
    // Reset any child view states
    setEditingLkm(null);
    setGradingSubmissionId(null);
    setPrintingLkmId(null);
    setActiveWorksheetAssignmentId(null);
  };

  const submissions = StorageService.getSubmissions();
  const pendingGradingCount = submissions.filter((s) => s.status === 'sudah_dikumpulkan').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onOpenUserSwitcher={() => setUserSwitcherOpen(true)}
        onOpenGasModal={() => setGasModalOpen(true)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          role={currentUser.role}
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setEditingLkm(null);
            setPrintingLkmId(null);
            setActiveWorksheetAssignmentId(null);
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          pendingGradingCount={pendingGradingCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Printable A4 View */}
          {printingLkmId ? (
            <PrintableLkm
              lkmId={printingLkmId}
              onBack={() => setPrintingLkmId(null)}
            />
          ) : activeWorksheetAssignmentId ? (
            /* Student Worksheet Interactive View */
            <LkmWorksheet
              assignmentId={activeWorksheetAssignmentId}
              currentUser={currentUser}
              onBack={() => setActiveWorksheetAssignmentId(null)}
              onSubmitSuccess={() => {
                setActiveWorksheetAssignmentId(null);
                setCurrentTab('riwayat_nilai');
              }}
            />
          ) : (
            <>
              {/* GURU VIEWS */}
              {currentUser.role === 'guru' && (
                <>
                  {currentTab === 'dashboard' && (
                    <GuruDashboard
                      onNavigate={(tab) => setCurrentTab(tab)}
                      onGradeSubmission={(subId) => setGradingSubmissionId(subId)}
                      onPrintLkm={(lkmId) => setPrintingLkmId(lkmId)}
                    />
                  )}

                  {currentTab === 'bank_lkm' && (
                    <LkmBank
                      onCreateNew={() => {
                        setEditingLkm(null);
                        setCurrentTab('buat_lkm');
                      }}
                      onEditLkm={(lkm) => {
                        setEditingLkm(lkm);
                        setCurrentTab('buat_lkm');
                      }}
                      onAssignLkm={(lkmId) => {
                        setCurrentTab('penugasan');
                      }}
                      onPrintLkm={(lkmId) => setPrintingLkmId(lkmId)}
                    />
                  )}

                  {currentTab === 'buat_lkm' && (
                    <LkmBuilder
                      initialLkm={editingLkm}
                      onSaveSuccess={(lkm) => {
                        showToast(`LKM "${lkm.judul}" berhasil disimpan!`, 'success');
                        setEditingLkm(null);
                        setCurrentTab('bank_lkm');
                      }}
                      onCancel={() => {
                        setEditingLkm(null);
                        setCurrentTab('bank_lkm');
                      }}
                    />
                  )}

                  {currentTab === 'penugasan' && (
                    <AssignmentManager
                      onNavigateToMonitoring={() => setCurrentTab('monitoring')}
                    />
                  )}

                  {currentTab === 'kelompok' && <GroupManager />}

                  {currentTab === 'monitoring' && (
                    <MonitoringPengerjaan
                      onGradeSubmission={(subId) => setGradingSubmissionId(subId)}
                      onViewSubmission={(subId) => setGradingSubmissionId(subId)}
                    />
                  )}

                  {currentTab === 'penilaian' && (
                    <MonitoringPengerjaan
                      onGradeSubmission={(subId) => setGradingSubmissionId(subId)}
                      onViewSubmission={(subId) => setGradingSubmissionId(subId)}
                    />
                  )}

                  {currentTab === 'rekap_nilai' && <RekapNilai />}

                  {currentTab === 'data_murid_kelas' && <DataMuridKelas />}

                  {currentTab === 'gas_sync' && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                      <h3 className="font-extrabold text-base text-slate-900">
                        Integrasi Google Apps Script & Google Spreadsheet
                      </h3>
                      <p className="text-xs text-slate-600">
                        Aplikasi ini dapat disinkronkan secara langsung dengan Google Spreadsheet sekolah
                        Anda melalui skrip Google Apps Script (Web App Webhook).
                      </p>
                      <button
                        onClick={() => setGasModalOpen(true)}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                      >
                        Buka Pusat Kode & Hub Integrasi Apps Script &rarr;
                      </button>
                    </div>
                  )}

                  {currentTab === 'pengaturan' && <AdminDashboard />}
                </>
              )}

              {/* MURID VIEWS */}
              {currentUser.role === 'murid' && (
                <>
                  {currentTab === 'murid_dashboard' && (
                    <MuridDashboard
                      currentUser={currentUser}
                      onOpenWorksheet={(asgId) => setActiveWorksheetAssignmentId(asgId)}
                      onViewGrade={(subId) => setCurrentTab('riwayat_nilai')}
                    />
                  )}

                  {currentTab === 'lkm_saya' && (
                    <MuridDashboard
                      currentUser={currentUser}
                      onOpenWorksheet={(asgId) => setActiveWorksheetAssignmentId(asgId)}
                      onViewGrade={(subId) => setCurrentTab('riwayat_nilai')}
                    />
                  )}

                  {currentTab === 'riwayat_nilai' && (
                    <RiwayatNilai
                      currentUser={currentUser}
                      onOpenWorksheet={(asgId) => setActiveWorksheetAssignmentId(asgId)}
                    />
                  )}

                  {currentTab === 'refleksi' && <MuridRefleksi currentUser={currentUser} />}

                  {currentTab === 'profil' && <MuridProfil currentUser={currentUser} />}
                </>
              )}

              {/* ADMIN VIEWS */}
              {currentUser.role === 'admin' && <AdminDashboard />}
            </>
          )}
        </main>
      </div>

      {/* User Switcher Modal */}
      <UserSwitcherModal
        isOpen={userSwitcherOpen}
        onClose={() => setUserSwitcherOpen(false)}
        currentUser={currentUser}
        onSelectUser={handleUserChanged}
      />

      {/* Google Apps Script Integration Modal */}
      <GasIntegrationModal
        isOpen={gasModalOpen}
        onClose={() => setGasModalOpen(false)}
      />

      {/* Grading Modal */}
      {gradingSubmissionId && (
        <PenilaianModal
          submissionId={gradingSubmissionId}
          onClose={() => setGradingSubmissionId(null)}
          onSaved={() => setGradingSubmissionId(null)}
        />
      )}

      {/* In-app Toast notifications */}
      <ToastContainer />
    </div>
  );
}
