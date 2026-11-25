/* Species Black Mountain Seafood often carries (from the shop chalkboard; the case changes weekly).
   d = typical depth range in feet (approximate), at = depth where it swims on the page.
   fresh = freshwater fish, shown in the mountain-lakes inlet instead of the ocean column.
   Pictures: NOAA Fisheries and USFWS (public domain) unless credit says otherwise. */
window.SPECIES = [
  {id:"oyster", name:"Oysters", sci:"Crassostrea virginica", img:"oyster", d:[0,25], at:6, w:110, note:"Wild Stump Sound oysters from the North Carolina coast, plus shucked oysters by the pint."},
  {id:"seatrout", name:"Sea trout", sci:"Cynoscion nebulosus", img:"seatrout", d:[0,30], at:9, w:200, note:"Spotted seatrout from grassy coastal flats. Mild and flaky."},
  {id:"red-drum", name:"Redfish", sci:"Sciaenops ocellatus", img:"red-drum", d:[0,230], at:14, w:210, note:"Red drum, the copper fish with a spot on its tail. Great blackened."},
  {id:"pompano", name:"Pompano", sci:"Trachinotus carolinus", img:"pompano", d:[0,130], at:18, w:180, note:"A surf-zone fish with rich, buttery fillets."},
  {id:"sheepshead", name:"Sheepshead", sci:"Archosargus probatocephalus", img:"sheepshead", d:[0,50], at:22, w:190, note:"Striped pier-piling fish with people-like teeth for crunching shellfish."},
  {id:"shrimp", name:"NC shrimp", sci:"Penaeus aztecus", img:"brown-shrimp", d:[0,360], at:26, w:170, note:"North Carolina shrimp, caught off our own coast."},
  {id:"black-drum", name:"Black drum", sci:"Pogonias cromis", img:"black-drum", d:[0,100], at:32, w:210, note:"The redfish's bigger cousin. Firm and mild."},
  {id:"spanish-mackerel", name:"Spanish mackerel", sci:"Scomberomorus maculatus", img:"spanish-mackerel", d:[0,115], at:38, w:220, note:"A fast, spotted coastal runner. Rich flavor, best very fresh."},
  {id:"branzino", name:"Branzino", sci:"Dicentrarchus labrax", img:"branzino", d:[0,330], at:44, w:190, note:"European sea bass. Roast it whole.", credit:"Illustration: Almae scientia, CC BY 4.0"},
  {id:"mahi", name:"Mahi", sci:"Coryphaena hippurus", img:"mahi", d:[0,280], at:52, w:240, note:"Electric green and gold in the open ocean, sweet and firm on the plate."},
  {id:"salmon", name:"Salmon", sci:"Salmo salar", img:"salmon", d:[0,330], at:62, w:220, note:"Atlantic salmon. Rich, versatile, always a favorite."},
  {id:"rockfish", name:"Rockfish", sci:"Morone saxatilis", img:"rockfish", d:[0,100], at:74, w:230, note:"Striped bass, called rockfish along the mid-Atlantic."},
  {id:"flounder", name:"Flounder", sci:"Paralichthys dentatus", img:"flounder", d:[0,500], at:88, w:200, note:"A flatfish that lies on the sand with both eyes on one side."},
  {id:"wahoo", name:"Wahoo", sci:"Acanthocybium solandri", img:"wahoo", d:[0,400], at:105, w:260, note:"One of the fastest fish in the sea. Firm, white and mild."},
  {id:"argentine-shrimp", name:"Argentine pinks", sci:"Pleoticus muelleri", img:"argentine-shrimp", d:[10,330], at:125, w:150, note:"Argentine red shrimp. Sweet like lobster, cooks in half the time.", credit:"Photo: Assianir, CC BY-SA 3.0"},
  {id:"triggerfish", name:"Triggerfish", sci:"Balistes capriscus", img:"triggerfish", d:[30,330], at:145, w:180, note:"Gray triggerfish from reefs and wrecks. Clean, sweet fillets."},
  {id:"black-sea-bass", name:"Black sea bass", sci:"Centropristis striata", img:"black-sea-bass", d:[6,425], at:165, w:190, note:"A reef fish with delicate white meat."},
  {id:"tuna", name:"Tuna", sci:"Thunnus thynnus", img:"bluefin-tuna", d:[0,1600], at:190, w:280, note:"Bluefin tuna roam from the surface to deep water. Sear it rare."},
  {id:"scallop", name:"Scallops", sci:"Placopecten magellanicus", img:"scallop", d:[60,360], at:215, w:120, note:"Atlantic sea scallops from cold sandy bottoms."},
  {id:"snapper", name:"Snapper", sci:"Lutjanus campechanus", img:"snapper", d:[30,620], at:245, w:210, note:"Red snapper from offshore reefs. A southern classic."},
  {id:"grouper", name:"Grouper", sci:"Mycteroperca microlepis", img:"grouper", d:[60,500], at:280, w:230, note:"Gag grouper. Thick, mild fillets that hold up to anything."},
  {id:"lobster", name:"Lobster tails", sci:"Homarus americanus", img:"lobster", d:[15,1600], at:320, w:200, note:"Cold-water lobster tails."},
  {id:"haddock", name:"Haddock", sci:"Melanogrammus aeglefinus", img:"haddock", d:[130,490], at:370, w:210, note:"A North Atlantic classic for fish and chips."},
  {id:"cod", name:"Cod", sci:"Gadus morhua", img:"cod", d:[150,650], at:430, w:220, note:"Atlantic cod. Big flakes, mild and clean."},
  {id:"halibut", name:"Halibut", sci:"Hippoglossus hippoglossus", img:"halibut", d:[165,3300], at:700, w:230, note:"The giant of the flatfish. Ask about halibut cheeks."},
  {id:"tilefish", name:"Tilefish", sci:"Lopholatilus chamaeleonticeps", img:"tilefish", d:[260,1770], at:900, w:220, note:"Golden tilefish dig burrows in deep clay. Tastes a bit like lobster."},
  {id:"swordfish", name:"Swordfish", sci:"Xiphias gladius", img:"swordfish", d:[0,2000], at:1650, w:300, note:"By day, swordfish hunt down here in the dark. Thick steaks for the grill."},
  {id:"char", name:"Arctic char", sci:"Salvelinus alpinus", img:"char", fresh:true, d:[0,230], w:230, note:"A cold-lake cousin of salmon and trout."},
  {id:"walleye", name:"Walleye", sci:"Sander vitreus", img:"walleye", fresh:true, d:[10,50], w:220, note:"A North American lake fish with glassy eyes and sweet fillets."},
  {id:"catfish", name:"Catfish", sci:"Ictalurus punctatus", img:"catfish", fresh:true, d:[0,40], w:220, note:"Channel catfish, made for the fryer."}
];
