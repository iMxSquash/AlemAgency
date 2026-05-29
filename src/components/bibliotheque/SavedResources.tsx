import { FileText, Play, Heart } from "lucide-react";

const SAVED = [
  { id: "1", icon: FileText, color: "text-blue-500", title: "Fiche pictogrammes transitions", subtitle: "Fiche pratique · sauvegardée hier" },
  { id: "2", icon: Play, color: "text-green-500", title: "Webinaire · DYS au quotidien", subtitle: "Vidéo · sauvegardée hier" },
  { id: "3", icon: Heart, color: "text-pink-500", title: "Scripts dialogue parents", subtitle: "Article · sauvegardée la semaine dernière" },
];

export function SavedResources() {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Mes ressources sauvegardées</h2>
        <span className="text-sm text-gray-500">21 éléments</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SAVED.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:shadow-sm transition-shadow cursor-pointer"
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${item.color}`} />
              <div>
                <p className="text-sm font-medium text-gray-900 leading-snug">{item.title}</p>
                <p className="text-xs text-gray-400">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}