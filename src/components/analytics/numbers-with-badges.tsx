import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDown,
  ArrowUp,
  Users,
  DollarSign,
  ShoppingCart,
  Activity,
} from "lucide-react";

export default function NumbersWithBadges() {
  return (

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-primary">
                  <Users className="mr-1 h-3 w-3" />
                  Visualiações
                </Badge>
                <span className="flex items-center gap-0.5 text-green-700 dark:text-green-400">
                  <ArrowUp className="w-3 h-3" />
                  <span className="text-xs">12%</span>
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold">2,340</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Active users
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
                  <DollarSign className="mr-1 h-3 w-3" />
                  Mais acessada
                </Badge>
                <span className="flex items-center gap-0.5 text-green-700 dark:text-green-400">
                  <ArrowUp className="w-3 h-3" />
                  <span className="text-xs">8.5%</span>
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold">$12,430</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Monthly revenue
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
                  <ShoppingCart className="mr-1 h-3 w-3" />
                  Interação
                </Badge>
                <span className="flex items-center gap-0.5 text-red-700 dark:text-red-400">
                  <ArrowDown className="w-3 h-3" />
                  <span className="text-xs">4.2%</span>
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold">1,240</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Weekly sales
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
                  <Activity className="mr-1 h-3 w-3" />
                  Cliques em link
                </Badge>
                <span className="flex items-center gap-0.5 text-green-700 dark:text-green-400">
                  <ArrowUp className="w-3 h-3" />
                  <span className="text-xs">2.4%</span>
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold">24.5%</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Conversion rate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    
  );
}
