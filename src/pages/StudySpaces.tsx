import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Clock, Info, Armchair, Users, User, CheckCircle2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase"; // Import your initialized client 
import { useToast } from "@/hooks/use-toast";

export default function StudySpaces() {
  const [loading, setLoading] = useState(true);
  interface Seat {
    id: string;
    status?: string | null;
    vacant_at?: string | null;
    type?: string | null;
    parent?: string | null;
    [key: string]: unknown;
  }

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const { toast } = useToast();

  // 1. Fetch real-time data from Supabase on component mount 
  useEffect(() => {
    const fetchSeats = async () => {
      const { data, error } = await supabase
        .from('lrc_seats')
        .select('*');
      
      if (error) {
        toast({ variant: "destructive", title: "Connection Error", description: error.message });
      } else {
        setSeats(data || []);
      }
      setLoading(false);
    };

    fetchSeats();

    // 2. Subscribe to Real-time updates so the UI reflects changes instantly 
    const channel = supabase
      .channel('lrc_realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'lrc_seats' }, (payload) => {
        setSeats((currentSeats) => 
          currentSeats.map((s) => s.id === payload.new.id ? payload.new : s)
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // 3. Logic to handle seat reservation 
  const handleBooking = async () => {
    if (!selectedSeat) return;
    if (selectedSeat.status === 'Occupied') {
      toast({ variant: 'destructive', title: 'Booking Failed', description: 'Seat is already occupied.' });
      return;
    }

    // Ensure we have a valid id
    const seatId = (selectedSeat as { id?: string }).id;
    if (!seatId) {
      toast({ variant: 'destructive', title: 'Booking Failed', description: 'Selected seat has no id.' });
      console.error('Attempted to book a seat without id', selectedSeat);
      return;
    }

    // Sets vacancy time to 2 hours from now as per project goal
    const vacantAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

    try {
      // return the updated row so we can update local state
      const { data, error } = await supabase
        .from('lrc_seats')
        .update({ status: 'Occupied', vacant_at: vacantAt })
        .eq('id', seatId)
        .select()
        .single();
      if (error) {
        console.error('Supabase update error', error);
        const errMsg = (error as { message?: string })?.message || JSON.stringify(error);
        toast({ variant: 'destructive', title: 'Booking Failed', description: errMsg });
        return;
      }

      // Update local state with the new seat data
      const updated = data as Seat | null;
      if (updated) {
        setSeats((currentSeats) => currentSeats.map((s) => (s.id === seatId ? updated : s)));
        setSelectedSeat(updated);
        toast({ title: 'Success!', description: `Seat ${seatId} reserved successfully.` });
      } else {
        toast({ variant: 'destructive', title: 'Booking Failed', description: 'No updated seat returned from server.' });
      }
      toast({ title: 'Success!', description: `Seat ${seatId} reserved successfully.` });
    } catch (err) {
      console.error('Unexpected error booking seat', err);
      toast({ variant: 'destructive', title: 'Booking Failed', description: (err as Error).message || String(err) });
    }
  };

  const getSeatData = (id: string) => seats.find(s => s.id === id) ?? ({ status: 'Available' } as Seat);

  // Helper for rendering interactive seat dots
  const SeatDot = ({ id, type, parent }: { id: string, type: string, parent?: string }) => {
    const data = getSeatData(id);
    const isOccupied = data.status === 'Occupied';
    
    return (
      <button
        onClick={() => setSelectedSeat({ id, type, parent, ...data })}
        className={`w-5 h-5 rounded-full border-2 transition-all hover:scale-125
          ${isOccupied ? 'bg-destructive border-destructive/20' : 'bg-success border-success/20 hover:brightness-110'}
          ${selectedSeat?.id === id ? 'ring-2 ring-primary ring-offset-1 scale-125' : ''}`}
      />
    );
  };

  const GroupTable = ({ tableId }: { tableId: string }) => (
    <div className="flex flex-col items-center gap-2 p-2 bg-slate-50/50 rounded-xl border border-slate-100 shadow-sm">
      <span className="text-[9px] font-black text-slate-400 mb-1">{tableId}</span>
      <div className="grid grid-cols-5 gap-2">
        {[...Array(10)].map((_, i) => (
          <SeatDot key={i} id={`${tableId}-S${i + 1}`} type="Group Table Seat" parent={tableId} />
        ))}
      </div>
      <div className="w-full h-8 bg-amber-100/80 border border-amber-200 rounded-md" />
    </div>
  );

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="animate-fade-in flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">LRC Floor Plan</h1>
            <p className="text-muted-foreground">Real-time study space management </p>
          </div>
        </header>

        <div className="grid lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3 bg-white border-2 border-slate-200 shadow-xl relative overflow-hidden h-[800px] p-8">
            {/* Floor Map Elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-sky-50 flex justify-around" />
            
            {/* Sofa Zone */}
            <div className="absolute top-8 left-12 right-12 flex justify-between">
              {[...Array(6)].map((_, i) => {
                const id = `Sofa-${i+1}`;
                return (
                  <button 
                    key={id} 
                    onClick={() => setSelectedSeat({ id, type: 'Casual Sofa', ...getSeatData(id) })}
                    className="w-24 h-12 bg-slate-100 border-b-4 border-slate-200 rounded-t-xl flex items-center justify-center text-[10px] font-bold text-slate-400"
                  >
                    SOFA
                  </button>
                );
              })}
            </div>

            {/* Perimeter Group Tables */}
            <div className="absolute left-6 top-32 bottom-20 flex flex-col justify-between">
              {[...Array(7)].map((_, i) => <GroupTable key={i} tableId={`GT-L${i+1}`} />)}
            </div>
            <div className="absolute right-6 top-32 bottom-20 flex flex-col justify-between">
              {[...Array(7)].map((_, i) => <GroupTable key={i} tableId={`GT-R${i+1}`} />)}
            </div>

            {/* Central Individual Rows */}
            <div className="absolute inset-x-44 top-32 bottom-32 bg-slate-50/30 rounded-3xl border border-dashed border-slate-200 p-10 flex items-center justify-center">
              <div className="grid grid-cols-8 gap-6">
                 {[...Array(48)].map((_, i) => (
                   <SeatDot key={i} id={`I-${i+1}`} type="Individual Study Area" />
                 ))}
              </div>
            </div>

            {/* Entry Gate */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-20 border-t-4 border-slate-900 bg-white flex flex-col items-center pt-2">
              <span className="text-[10px] font-black tracking-[0.2em] text-slate-900">MAIN ENTRY GATE</span>
            </div>
          </Card>

          {/* Booking Sidebar  */}
          <aside className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Resource Status
              </h3>
              
              {selectedSeat ? (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-2xl font-black text-slate-800">{selectedSeat.id}</p>
                    <p className="text-xs text-slate-500 mt-1">{selectedSeat.type}</p>
                  </div>

                  <div className={`p-4 rounded-xl border-2 ${selectedSeat.status === 'Occupied' ? 'bg-destructive/5 border-destructive/10 text-destructive' : 'bg-success/5 border-success/10 text-success'}`}>
                    <p className="font-bold text-sm mb-1">{selectedSeat.status}</p>
                    {selectedSeat.vacant_at && (
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="w-3 h-3" />
                        Vacant at {new Date(selectedSeat.vacant_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={handleBooking}
                    disabled={selectedSeat.status === 'Occupied'}
                    className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all ${selectedSeat.status === 'Occupied' ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-primary text-primary-foreground hover:brightness-110'}`}
                  >
                    {selectedSeat.status === 'Occupied' ? 'Notify Me When Free' : 'Confirm Seat Booking'}
                  </button>
                </div>
              ) : (
                <p className="py-20 text-center text-slate-400 italic text-sm">Select a resource to view status.</p>
              )}
            </Card>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}