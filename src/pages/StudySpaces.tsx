import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, Info, Armchair, Users, User, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const buildings = ["All Buildings", "Library", "Student Center", "Engineering", "Science Hall"];

export default function StudySpaces() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState("Library");
  const [selectedSeat, setSelectedSeat] = useState<any>(null);

  // Enhanced Group Study Table with individual seat booking
  const GroupTable = ({ tableId }: { tableId: string }) => (
    <div className="flex flex-col items-center gap-2 p-2 bg-slate-50/50 rounded-xl border border-slate-100 shadow-sm">
      <span className="text-[9px] font-black text-slate-400 mb-1">{tableId}</span>
      <div className="grid grid-cols-5 gap-2">
        {[...Array(10)].map((_, i) => {
          const seatId = `${tableId}-S${i + 1}`;
          const isOccupied = Math.random() > 0.8;
          return (
            <button
              key={seatId}
              onClick={() => setSelectedSeat({ 
                id: seatId, 
                type: 'Group Table Seat', 
                parent: tableId,
                status: isOccupied ? 'Occupied' : 'Available',
                time: isOccupied ? '4:00 PM' : null 
              })}
              className={`w-5 h-5 rounded-full border-2 transition-all hover:scale-125
                ${isOccupied ? 'bg-destructive border-destructive/20' : 'bg-success border-success/20 hover:brightness-110'}
                ${selectedSeat?.id === seatId ? 'ring-2 ring-primary ring-offset-1 scale-125' : ''}`}
              title={seatId}
            />
          );
        })}
      </div>
      <div className="w-full h-8 bg-amber-100/80 border border-amber-200 rounded-md flex items-center justify-center">
         <div className="w-1/2 h-1 bg-amber-200 rounded-full" />
      </div>
    </div>
  );

  // Individual Table Area
  const IndividualTable = ({ id }: { id: string }) => {
    const isOccupied = Math.random() > 0.6;
    return (
      <button
        onClick={() => setSelectedSeat({ id, type: 'Individual Study Area', status: isOccupied ? 'Occupied' : 'Available', time: isOccupied ? '2:45 PM' : null })}
        className={`w-8 h-8 rounded border-2 transition-all flex items-center justify-center text-[8px] font-bold
          ${isOccupied ? 'bg-destructive/10 border-destructive/30 text-destructive' : 'bg-success/10 border-success/30 text-success hover:scale-110 shadow-sm'}
          ${selectedSeat?.id === id ? 'ring-2 ring-primary ring-offset-1' : ''}`}
      >
        {id}
      </button>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">LRC Floor Plan</h1>
            <p className="text-muted-foreground">Select any individual seat or a specific seat at a group table</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3 bg-white border-2 border-slate-200 shadow-xl relative overflow-hidden h-[800px] p-8">
            
            {/* Window & Sofa Zone */}
            <div className="absolute top-0 left-0 w-full h-2 bg-sky-50 flex justify-around">
              {[...Array(12)].map((_, i) => <div key={i} className="w-12 h-full border-x border-sky-100" />)}
            </div>
            <div className="absolute top-8 left-12 right-12 flex justify-between">
              {[...Array(6)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedSeat({ id: `Sofa-${i+1}`, type: 'Casual Sofa', status: 'Available' })}
                  className="w-24 h-12 bg-slate-100 border-b-4 border-slate-200 rounded-t-xl flex items-center justify-center text-[10px] font-bold text-slate-400 hover:bg-slate-200 transition-all"
                >
                  SOFA
                </button>
              ))}
            </div>

            {/* Group Tables - Left & Right (30 Tables Total) */}
            <div className="absolute left-6 top-32 bottom-20 flex flex-col justify-between">
              {[...Array(7)].map((_, i) => <GroupTable key={i} tableId={`GT-L${i+1}`} />)}
            </div>
            <div className="absolute right-6 top-32 bottom-20 flex flex-col justify-between">
              {[...Array(7)].map((_, i) => <GroupTable key={i} tableId={`GT-R${i+1}`} />)}
            </div>

            {/* Individual Study Central Rows */}
            <div className="absolute inset-x-44 top-32 bottom-32 bg-slate-50/30 rounded-3xl border border-dashed border-slate-200 p-10">
              <div className="grid grid-cols-8 gap-6 h-full place-content-center">
                 {[...Array(48)].map((_, i) => <IndividualTable key={i} id={`I-${i+1}`} />)}
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-300 tracking-[0.4em]">CENTRAL STUDY ZONE</div>
            </div>

            {/* Entry Gate Area */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-20 border-t-4 border-slate-900 bg-white flex flex-col items-center pt-2">
              <div className="text-[10px] font-black tracking-[0.2em] text-slate-900 mb-2">MAIN ENTRY GATE</div>
              <div className="flex gap-4">
                <div className="px-4 py-1 bg-slate-100 border rounded text-[9px] font-bold">RECEPTION</div>
                <div className="px-4 py-1 bg-slate-100 border rounded text-[9px] font-bold">SECURITY</div>
              </div>
            </div>
          </Card>

          {/* Booking Sidebar */}
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Booking Details
              </h3>
              
              {selectedSeat ? (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Resource ID</p>
                    <p className="text-2xl font-black text-slate-800">{selectedSeat.id}</p>
                    <p className="text-xs text-slate-500 mt-1">{selectedSeat.type}</p>
                  </div>

                  <div className={`p-4 rounded-xl border-2 ${selectedSeat.status === 'Occupied' ? 'bg-destructive/5 border-destructive/10' : 'bg-success/5 border-success/10'}`}>
                    <p className="font-bold text-sm mb-1">{selectedSeat.status}</p>
                    {selectedSeat.time && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Clock className="w-3 h-3" />
                        Vacant at {selectedSeat.time}
                      </div>
                    )}
                  </div>

                  <button className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:brightness-110 shadow-lg transition-all active:scale-95">
                    {selectedSeat.status === 'Occupied' ? 'Notify Me When Free' : 'Confirm Seat Booking'}
                  </button>
                </div>
              ) : (
                <div className="py-20 text-center text-slate-400 italic text-sm">
                  Click on any specific seat dot to begin your reservation.
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}