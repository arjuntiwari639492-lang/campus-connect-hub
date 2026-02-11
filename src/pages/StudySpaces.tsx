import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  User, 
  CheckCircle2, 
  Loader2, 
  BellRing, 
  Timer, 
  Search, 
  Info, 
  Zap,
  Armchair
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase"; 
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

// Interface for Seat Data
interface Seat {
  id: string;
  status?: string | null;
  vacant_at?: string | null;
  type?: string | null;
  parent?: string | null;
  [key: string]: unknown;
}

export default function StudySpaces() {
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [bookingDuration, setBookingDuration] = useState([120]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const [notifyList, setNotifyList] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('notifySeats');
      return raw ? JSON.parse(raw) as string[] : [];
    } catch { return []; }
  });

  // Calculate Statistics
  const stats = useMemo(() => {
    const total = seats.length || 1;
    const occupied = seats.filter(s => s.status === 'Occupied').length;
    return {
      total,
      occupied,
      available: total - occupied,
      percent: Math.round((occupied / total) * 100)
    };
  }, [seats]);

  useEffect(() => {
    const fetchSeats = async () => {
      const { data, error } = await (supabase as any).from('lrc_seats').select('*');
      if (error) {
        toast({ variant: "destructive", title: "Connection Error", description: error.message });
      } else {
        setSeats((data as Seat[]) || []);
      }
      setLoading(false);
    };

    fetchSeats();

    const channel = (supabase as any)
      .channel('lrc_realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'lrc_seats' }, (payload: any) => {
        const updatedSeat = payload.new as Seat;
        setSeats((currentSeats) => currentSeats.map((s) => s.id === updatedSeat.id ? updatedSeat : s));

        if (updatedSeat.status === 'Available') {
          setNotifyList((prev) => {
            if (prev.includes(updatedSeat.id)) {
              toast({ title: 'Resource Available!', description: `Seat ${updatedSeat.id} is now free.` });
              const next = prev.filter((id) => id !== updatedSeat.id);
              localStorage.setItem('notifySeats', JSON.stringify(next));
              return next;
            }
            return prev;
          });
        }
      })
      .subscribe();

    return () => { (supabase as any).removeChannel(channel); };
  }, [toast]);

  const handleBooking = async () => {
    if (!selectedSeat || selectedSeat.status === 'Occupied') return;
    const vacantAt = new Date(Date.now() + bookingDuration[0] * 60 * 1000).toISOString();

    const { error } = await (supabase as any)
      .from('lrc_seats')
      .update({ status: 'Occupied', vacant_at: vacantAt })
      .eq('id', selectedSeat.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Booking Failed', description: error.message });
    } else {
      toast({ title: 'Success!', description: `Seat ${selectedSeat.id} reserved.` });
      setSelectedSeat(null);
    }
  };

  const handleNotifyMe = () => {
    if (!selectedSeat) return;
    const id = selectedSeat.id;
    setNotifyList((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem('notifySeats', JSON.stringify(next));
      toast({ title: 'Notification Set', description: `Alerting you when ${id} is free.` });
      return next;
    });
  };

  const getSeatData = (id: string) => seats.find(s => s.id === id) ?? ({ status: 'Available' } as Seat);

  /**
   * 3D CHAIR COMPONENT
   * Uses skew and multiple shadows to create depth
   */
  const Chair = ({ id, type }: { id: string, type: string }) => {
    const data = getSeatData(id);
    const isOccupied = data.status === 'Occupied';
    const isSelected = selectedSeat?.id === id;

    return (
      <div className="relative group flex flex-col items-center">
        <button
          onClick={() => {
            setSelectedSeat({ id, type, ...data });
            if (!isOccupied) setBookingDuration([120]);
          }}
          className={`
            relative w-7 h-7 transition-all duration-300 transform
            ${isSelected ? '-translate-y-2 scale-110' : 'hover:-translate-y-1'}
            ${isOccupied ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {/* Chair Backrest (The 3D part) */}
          <div className={`
            absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-2 rounded-t-sm
            ${isOccupied ? 'bg-red-700' : 'bg-emerald-700'}
          `} />
          
          {/* Chair Seat Cushion */}
          <div className={`
            w-full h-full rounded-md shadow-[0_4px_0_0_rgba(0,0,0,0.2)]
            flex items-center justify-center border-b-4
            ${isOccupied 
              ? 'bg-red-500 border-red-700 shadow-red-900/20' 
              : 'bg-emerald-500 border-emerald-700 shadow-emerald-900/20'}
            ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
          `}>
            <User className="w-3 h-3 text-white/50" />
          </div>
        </button>
        {isSelected && <div className="absolute -bottom-1 w-2 h-2 bg-blue-500 rotate-45 animate-bounce" />}
      </div>
    );
  };

  /**
   * 3D SOFA COMPONENT
   */
  const Sofa = ({ id }: { id: string }) => {
    const data = getSeatData(id);
    const isOccupied = data.status === 'Occupied';
    const isSelected = selectedSeat?.id === id;

    return (
      <button
        onClick={() => setSelectedSeat({ id, type: 'Premium Sofa', ...data })}
        className={`
          relative w-28 h-14 transition-all duration-300
          rounded-xl border-b-[6px] flex flex-col items-center justify-center
          ${isOccupied 
            ? 'bg-slate-300 border-slate-400 text-slate-500' 
            : 'bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-50'}
          ${isSelected ? 'ring-4 ring-blue-500 ring-offset-2 -translate-y-1' : ''}
        `}
      >
        <div className="absolute top-1 left-2 right-2 h-2 bg-black/5 rounded-full" />
        <Armchair className={`w-5 h-5 ${isOccupied ? 'opacity-30' : 'opacity-80'}`} />
        <span className="text-[10px] font-bold mt-1">SOFA</span>
      </button>
    );
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin h-10 w-10 text-primary" />
      <p className="text-sm font-medium animate-pulse">Loading Floor Plan...</p>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header with Search & Stats */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border shadow-sm">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">LRC Grand Floor</h1>
            <div className="flex gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                {stats.available} Available
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                {stats.occupied} Occupied
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search seat ID..." 
                className="pl-9 bg-slate-50 border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Interactive Floor Plan */}
          <Card className="lg:col-span-3 bg-[#f8fafc] border-2 relative h-[850px] overflow-hidden shadow-inner flex items-center justify-center">
            
            {/* Architectural Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, size: '30px 30px' }} />

            <div className="relative w-full h-full max-w-5xl">
              
              {/* Top Sofa Lounge */}
              <div className="absolute top-10 left-10 right-10 flex justify-around">
                {[...Array(6)].map((_, i) => <Sofa key={i} id={`Sofa-${i+1}`} />)}
              </div>

              {/* Group Study Pods - Left */}
              <div className="absolute left-10 top-40 bottom-24 flex flex-col justify-between">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-slate-400">POD L{i+1}</span>
                    <div className="grid grid-cols-4 gap-3">
                      {[...Array(8)].map((_, j) => <Chair key={j} id={`GT-L${i+1}-S${j+1}`} type="Pod Seat" />)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Group Study Pods - Right */}
              <div className="absolute right-10 top-40 bottom-24 flex flex-col justify-between">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-slate-400">POD R{i+1}</span>
                    <div className="grid grid-cols-4 gap-3">
                      {[...Array(8)].map((_, j) => <Chair key={j} id={`GT-R${i+1}-S${j+1}`} type="Pod Seat" />)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Central Individual Focus Zone */}
              <div className="absolute inset-x-56 top-40 bottom-40 bg-white/50 rounded-[40px] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center gap-8 shadow-xl">
                 <div className="flex items-center gap-2 text-slate-400 mb-4">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-bold tracking-widest uppercase">Focus Zone</span>
                 </div>
                 <div className="grid grid-cols-8 gap-x-8 gap-y-10">
                    {[...Array(40)].map((_, i) => <Chair key={i} id={`I-${i+1}`} type="Individual Desk" />)}
                 </div>
              </div>

              {/* Entrance Aesthetic */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-16 bg-slate-900 rounded-t-3xl flex items-center justify-center shadow-2xl">
                 <div className="flex flex-col items-center">
                    <div className="w-12 h-1 bg-white/20 rounded-full mb-2" />
                    <span className="text-white text-xs font-black tracking-[0.4em]">MAIN ENTRANCE</span>
                 </div>
              </div>
            </div>
          </Card>

          {/* Right Sidebar - Info Panel */}
          <aside className="space-y-4">
            <Card className="p-6 border-2 shadow-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 p-2 opacity-5">
                <Info className="w-20 h-20" />
              </div>

              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                Seat Details
              </h3>
              
              {selectedSeat ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="p-5 bg-slate-900 rounded-2xl text-white shadow-xl">
                    <p className="text-3xl font-black italic">{selectedSeat.id}</p>
                    <p className="text-[10px] text-blue-400 mt-1 uppercase font-black tracking-tighter">
                      {selectedSeat.type}
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border-2 flex flex-col gap-1 ${
                    selectedSeat.status === 'Occupied' 
                    ? 'bg-red-50 border-red-100 text-red-700' 
                    : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase text-xs">Current Status</span>
                      <Badge className={selectedSeat.status === 'Occupied' ? 'bg-red-500' : 'bg-emerald-500'}>
                        {selectedSeat.status}
                      </Badge>
                    </div>
                    {selectedSeat.vacant_at && (
                      <div className="flex items-center gap-2 text-xs mt-2 font-medium opacity-80">
                        <Clock className="w-3.5 h-3.5" />
                        Estimated vacancy: {new Date(selectedSeat.vacant_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>

                  {selectedSeat.status === 'Available' ? (
                    <div className="space-y-4 p-5 border-2 border-slate-100 rounded-2xl bg-white shadow-sm">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5">
                          <Timer className="w-3 h-3" /> Booking Period
                        </p>
                        <span className="text-sm font-bold text-blue-600">{bookingDuration[0]}m</span>
                      </div>
                      
                      <Slider 
                        defaultValue={[120]} 
                        max={180} 
                        min={15} 
                        step={15} 
                        onValueChange={(val) => setBookingDuration(val)} 
                      />

                      <button 
                        onClick={handleBooking}
                        className="w-full py-4 rounded-xl font-black bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-[0_4px_0_0_#1e40af]"
                      >
                        CONFIRM BOOKING
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={handleNotifyMe}
                      className="w-full py-4 rounded-xl font-bold border-2 border-blue-600 text-blue-600 flex items-center justify-center gap-2 hover:bg-blue-50 transition-all active:scale-95"
                    >
                      <BellRing className="w-4 h-4" /> Notify When Available
                    </button>
                  )}
                </div>
              ) : (
                <div className="py-24 text-center border-2 border-dashed rounded-3xl bg-slate-50">
                  <Armchair className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest px-6">
                    Tap a seat on the map to view live availability
                  </p>
                </div>
              )}
            </Card>

            {/* Quick Stats Summary Card */}
            <Card className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-lg">
               <p className="text-[10px] font-bold opacity-80 uppercase mb-4">Live Capacity</p>
               <div className="flex items-end justify-between mb-2">
                  <span className="text-3xl font-black">{stats.percent}%</span>
                  <span className="text-xs opacity-80">Full House</span>
               </div>
               <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all duration-1000" style={{ width: `${stats.percent}%` }} />
               </div>
            </Card>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
} 