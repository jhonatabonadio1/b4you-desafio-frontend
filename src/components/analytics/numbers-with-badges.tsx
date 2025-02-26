import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Eye,
  Clock,
  Globe,
} from "lucide-react";

interface TrackingNumbersProps{
  data:{
  totalViews: number,
  totalInteractionTime: number,
  averageTimePerPage: number,
  sessions: number
  }
}

export default function NumbersWithBadges({data}: TrackingNumbersProps) {

  const formatSeconds = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.round(totalSeconds % 60);
  
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  
  return (

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
         <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-primary">
                  <Globe className="mr-1 h-3 w-3" />
                  Sessões iniciadas
                </Badge>
              
              </div>
              <div>
                <h3 className="text-2xl font-semibold">{data.sessions}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Sessões reais
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-primary">
                  <Eye className="mr-1 h-3 w-3" />
                  Visualiações 
                </Badge>
                {/**<span className="flex items-center gap-0.5 text-green-700 dark:text-green-400">
                  <ArrowUp className="w-3 h-3" />
                  <span className="text-xs">12%</span>
                </span>**/}
              </div>
              <div>
                <h3 className="text-2xl font-semibold">{data.totalViews}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Visualizações no total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-primary">
                  <Users className="mr-1 h-3 w-3" />
                  Interação total
                </Badge>
               
              </div>
               <div>
                <h3 className="text-2xl font-semibold">{formatSeconds(data.totalInteractionTime)}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Tempo no total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-primary">
                  <Clock className="mr-1 h-3 w-3" />
                 Tempo médio por página
                </Badge>
              
              </div>
            <div>
                <h3 className="text-2xl font-semibold">{formatSeconds(data.averageTimePerPage)}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                Tempo por página
                </p>
              </div> 
              
            </div>
          </CardContent>
        </Card>
      </div>
    
  );
}
