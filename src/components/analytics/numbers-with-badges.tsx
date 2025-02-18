import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  File,
  Eye,
  Clock,
} from "lucide-react";

interface TrackingNumbersProps{
  data:{
  totalViews: number,
  totalInteractionTime: number,
  averageTimePerPage: number,
  mostInteractedPage: number | null
  }
}

export default function NumbersWithBadges({data}: TrackingNumbersProps) {
  return (

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card */}
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
              {
                data.totalInteractionTime < 60 ?     <div>
                <h3 className="text-2xl font-semibold">{data.totalInteractionTime.toFixed(2).replace(".", ",")} s</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Tempo no total
                </p>
              </div> :     <div>
                <h3 className="text-2xl font-semibold">{(data.totalInteractionTime / 60).toFixed(2).replace(".", ",")} min</h3>
                <p className="text-xs text-muted-foreground mt-1">
                Tempo no total
                </p>
              </div>
              }
            </div>
          </CardContent>
        </Card>

        {/* Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-primary">
                  <File className="mr-1 h-3 w-3" />
                  Página destaque
                </Badge>
              
              </div>
              <div>
                <h3 className="text-2xl font-semibold">{data.mostInteractedPage ? "Pg. " + data.mostInteractedPage :  "Sem dados"}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Página em destaque
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
              {
                data.averageTimePerPage < 120 ?     <div>
                <h3 className="text-2xl font-semibold">{data.averageTimePerPage.toFixed(2).replace(".", ",")} s</h3>
                <p className="text-xs text-muted-foreground mt-1">
                Tempo por página
                </p>
              </div> :     <div>
                <h3 className="text-2xl font-semibold">{(data.averageTimePerPage / 60).toFixed(2).replace(".", ",")} min</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Tempo por página
                </p>
              </div>
              }
              
            </div>
          </CardContent>
        </Card>
      </div>
    
  );
}
