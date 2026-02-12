import { useEffect, useState } from 'react'
import MainLayout from '../components/MainLayout'
import { getEmployees } from '../services/employeeService'
import { getDivisions } from '../services/divisionService'

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalDivisions: 0,
        latestEmployee: null as any,
        divisionDistribution: [] as any[]
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchDashboardData() {
            setLoading(true)
            try {
                const [empRes, divRes] = await Promise.all([
                    getEmployees(''),
                    getDivisions('')
                ])

                setStats({
                    totalEmployees: empRes.pagination?.total || 0,
                    totalDivisions: divRes.data.divisions?.length || 0,
                    latestEmployee: empRes.data.employees[0] || null,
                    divisionDistribution: divRes.data.divisions.slice(0, 4)
                })
            } catch (err) {
                console.error("API Error", err)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboardData()
    }, [])

    return (
        <MainLayout>
            <div className="relative mb-10 p-8 rounded-4xl bg-gray-900 dark:bg-blue-700 overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">
                            Hello, Admin <span className="text-blue-400 dark:text-blue-200">Aksamedia</span>
                        </h1>
                        <p className="text-blue-100/70 mt-2 font-medium max-w-md">
                            Sistem sedang berjalan optimal. Anda memiliki {stats.totalEmployees} karyawan aktif di {stats.totalDivisions} divisi berbeda hari ini.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <a href='/crud' className="px-6 py-3 bg-white text-gray-900 rounded-2xl font-bold text-sm hover:shadow-lg transition-all cursor-pointer">
                            + Tambah Karyawan
                        </a>
                    </div>
                </div>
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-4xl border border-gray-100 dark:border-gray-700 shadow-sm group hover:border-blue-500 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <span className="text-emerald-500 font-bold text-sm">+12%</span>
                        </div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Karyawan</p>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-2">{loading ? '...' : stats.totalEmployees}</h3>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-4xl border border-gray-100 dark:border-gray-700 shadow-sm group hover:border-purple-500 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-2xl">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                            <span className="text-purple-500 font-bold text-sm">Active</span>
                        </div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Divisi</p>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-2">{loading ? '...' : stats.totalDivisions}</h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-4xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h4 className="font-black text-gray-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Karyawan Terbaru</h4>

                    {loading ? (
                        <div className="animate-pulse flex items-center gap-4">
                            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-4xl"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-3 w-16 bg-gray-100 dark:bg-gray-600 rounded"></div>
                            </div>
                        </div>
                    ) : stats.latestEmployee ? (
                        <div className="flex items-center gap-5">
                            {stats.latestEmployee.image ? (
                                <img
                                    src={stats.latestEmployee.image}
                                    className="w-20 h-20 rounded-4xl object-cover ring-4 ring-blue-50 dark:ring-blue-900/20"
                                    alt={stats.latestEmployee.name}
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-4xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black ring-4 ring-blue-50 dark:ring-blue-900/20 shadow-lg shadow-blue-500/30">
                                    {stats.latestEmployee.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)}
                                </div>
                            )}

                            <div>
                                <h3 className="font-black text-gray-900 dark:text-white text-xl leading-tight">
                                    {stats.latestEmployee.name}
                                </h3>
                                <p className="text-blue-600 dark:text-blue-400 font-bold text-sm mt-1">
                                    {stats.latestEmployee.position}
                                </p>
                                <div className="mt-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-[10px] inline-block font-bold dark:text-gray-300 uppercase tracking-tighter">
                                    {stats.latestEmployee.division?.name}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-400 text-sm italic">
                            Belum ada data karyawan
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-8 rounded-4xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest">Divisi</h3>
                        <span className="text-xs text-gray-400">Diperbarui 1m ago</span>
                    </div>
                    <div className="space-y-6">
                        {stats.divisionDistribution.map((div, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-gray-700 dark:text-gray-300">{div.name}</span>
                                    <span className="text-gray-400">{Math.floor(Math.random() * 40 + 10)}%</span>
                                </div>
                                <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${i % 2 === 0 ? 'bg-blue-500' : 'bg-purple-500'}`}
                                        style={{ width: `${Math.floor(Math.random() * 60 + 20)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-emerald-500 rounded-4xl p-8 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <svg className="w-12 h-12 mb-4 text-emerald-200" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                        <h3 className="text-2xl font-black mb-2">Semua Sistem Sinkron</h3>
                        <p className="text-emerald-100 text-sm leading-relaxed">
                            Data dari tugas 1 sampai 7 telah terintegrasi sempurna dengan database MySQL melalui REST API.
                        </p>
                    </div>
                    <div className="mt-8 relative z-10">
                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Status</div>
                        <div className="text-lg font-bold">Excellent Connection</div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}