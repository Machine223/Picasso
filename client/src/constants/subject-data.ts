import {Subject} from '../class/subject';

export const WELCOME: Subject[] = [
  { subjectTitle: 'Présentation', description: 'Bienvenue sur Projet Picasso! Ce guide vous permettra de vous familiariser ' +
      'avec les différentes fonctionnalités de l’application. ', imageLink: '/assets/Video/NouveauDessin.mp4' },
];

export const TOOLS: Subject[] = [
{ subjectTitle: 'Aérosol', description: 'Cet outil est disponible via la barre d’outils ou ' +
    'à l’aide du raccourci \'A\'.  Il est possible de faire varier le diamètre de l’aérosol en glissant ' +
    'le curseur prévu à cet effet dans le panneau d’attributs. ' +
    'Il est aussi possible de faire varier la vitesse d’émission de l’aérosol.',
    shortcut: 'A', imageLink: '/assets/Video/spray.mp4'},
{ subjectTitle: 'Annuler-refaire', description: 'Il est possible d’annuler une action en appuyant la flèche de gauche ' +
    'dans le menu des outils. Il est, aussi, possible d’effectuer l’action annulée avec le raccourci clavier \'Ctrl+Z\'. ' +
    'Il possible de refaire une action annulée avec la flèche droite dans la barre d’outils en appuyant sur ' +
    '\'Ctrl+Shift+Z\'.' , shortcut: 'Ctrl+Z, Ctrl+Shift+Z', imageLink: '/assets/Video/undoRedo.mp4'},
{ subjectTitle: 'Applicateur de couleur', description: 'Sélectionnez l\'applicateur de couleur ' +
    'via la barre d\'outils ou avec le raccourci \'R\'. Le ' +
    'clic gauche change la couleur intérieure avec la couleur principale.' +
    ' Le clic droit change la couleur de la bordure avec la couleur secondaire.',
    shortcut: 'R', imageLink: '/assets/Video/applicateurDeCouleur.mp4'},
{ subjectTitle: 'Crayon', description: 'Sélectionnez l’outil \'Crayon\' dans la barre d’outils ou utilisez le raccourci \'C\'. ' +
    'Il est possible de redimensionner l’épaisseur du trait avec la barre glissante.',
    shortcut: 'C', imageLink: '/assets/Video/crayon.mp4'},
{ subjectTitle: 'Créer un nouveau dessin', description: 'Il existe deux façons de créer un nouveau dessin: ' +
    'si vous vous trouvez sur le menu d\'accueil, appuyez sur le bouton \'Créer un nouveau dessin\'. ' +
    'Il vous est aussi possible de créer un nouveau dessin avec le raccourci \'Ctrl+O\'. ' +
    'Il est possible de choisir la taille de la surface du dessin ainsi que la couleur du fond d’écran.',
    shortcut: 'Ctrl+O', imageLink: '/assets/Video/NouveauDessin.mp4' },
{ subjectTitle: 'Efface', description: 'Sélectionner l\'outil efface via la barre d\'outils ou bien via le raccourci \'E\'. Faites un ' +
    'clic gauche pour sélectionner les images à effacer. Les objets avec des contours rouges vont être les objets effacés',
    shortcut: 'E', imageLink: '/assets/Video/efface.mp4' },
{subjectTitle: 'Ellipse', description: 'Sélectionnez l\'outil ellipse via la barre d\'outils ou bien en utilisant le raccourci \'2\'. ' +
    'Choisissez quel type de d\'ellipse vous désirez dans le menu (plein avec contour, avec contour, sans contour) ',
    shortcut: '2', imageLink: '/assets/Video/Ellipse.mp4'},
{ subjectTitle: 'Grille', description: 'Définissez les paramètres de la grille dans ' +
    'le panneau d\'attributs. Il vous est possible ' +
    'de définir l\'opacité de la grille en changeant le degré d\'opacité de cette dernière. ' +
    'Les raccourcis \'+\' et \'-\' permettent de changer la taille du quadrillage.',
    shortcut: '+, -', imageLink: '/assets/Video/grille.mp4'},
{ subjectTitle: 'Ligne', description: 'Sélectionnez l\'outil \'Ligne\' dans la barre d\'outils ou utilisez le raccourci \'L\'. ' +
    'Utilisez la barre d\'effacement de votre clavier pour effacer une ligne. Appuyez sur la touche \'Shift\' de votre clavier ' +
    'pour faire un angle de 45°.', shortcut: 'L', imageLink: '/assets/Video/ligne.mp4' },
{ subjectTitle: 'Pinceau', description: 'Sélectionnez l’outil \'Pinceau\' dans la barre d’outils ou utilisez le raccourci \'W\'. ',
    shortcut: 'W', imageLink: '/assets/Video/Brush.mp4' },
{ subjectTitle: 'Pipette', description: 'L\'outil pipette permet de sélectionner une couleur. Sélectionnez l\'outil pipette' +
    ' via la barre d\'outils ou avec le raccourci  \'I\'. Mettez le curseur de la souris sur une forme colorée. Faites un clic droit' +
    ' pour changer la couleur secondaire et un clic gauche pour changer la couleur primaire.',
    shortcut: 'I', imageLink: '/assets/Video/pipette.mp4' },
{ subjectTitle: 'Polygone', description: 'Sélectionnez l\'outil polygone ' +
    'via la barre d\'outils ou avec le raccourci \'3\'. ' +
    'Choisissez quel type de de polygone vous désirez dans le menu (' +
    'plein avec contour, avec contour, sans contour). Il vous est aussi possible de ' +
    'définir le nombre de côtés dans le panneau d\'attributs. ',
    shortcut: '3', imageLink: '/assets/Video/polygone.mp4' },
{ subjectTitle: 'Presse-papier', description: 'Sélectionnez l\'outil presse-papier afin de couper, copier, coller et supprimer des ' +
    'éléments de la vue. Vous pouvez utiliser les raccourcis clavier, respectivement \'Ctrl+X\', \'Ctrl+C\', \'Ctrl+V\' et \'Delete\', ' +
    'ou faire appel aux boutons dans le panneau d\'attributs de l\'outil Sélection.',
    shortcut: 'Ctrl+X, Ctrl+C, Ctrl+V, Delete', imageLink: '/assets/Video/Selection.mp4' },
{ subjectTitle: 'Rectangle', description: 'Sélectionnez l’outil \'Rectangle\' dans la barre d’outils ou utiliser le raccourci \'1\'. ' +
    'Appuyez sur \'Shift\' pour faire un carré.', shortcut: '1', imageLink: '/assets/Video/rectangle.mp4' },
{ subjectTitle: 'Seau de peinture', description: 'Sélectionnez l\'outil seau de peinture via la barre d\'outils ou en utilisant le ' +
    'raccourci \'B\'. Sélectionnez un espace fermé et effectuez un clic droit à l\'intérieur de cette dernière pour la remplir de votre ' +
    'couleur principale. Faites un clic gauche pour faire de même avec votre couleur secondaire.',
    shortcut: 'B', imageLink: '/assets/Video/seauDePeinture2.mp4' },
{ subjectTitle: 'Sélection ', description: 'L\'outil de sélection permet de sélectionner des éléments du dessin. Il ' +
    'est possible de déplacer les éléments sélectionnés en utilisant la souris ou les flèches du clavier.',
    shortcut: 'S', imageLink: '/assets/Video/Selection.mp4'},
{ subjectTitle: 'Sélection de couleur', description: 'Pour sélectionner une couleur, cliquez sur la palette de ' +
    'couleurs et sélectionnez une couleur avec le curseur.', shortcut: 'Aucun', imageLink: '/assets/Video/PaletteDeCouleur.mp4' },
{ subjectTitle: 'Sélection de couleur rapide', description: 'Pour sélectionner une couleur rapidement, faites un clic droit sur ' +
    'l\'un des cercles de couleur du panneau d\'attributs. Modifiez les couleurs grâce à l\'interface visuelle ou insérez manuellement ' +
    'le taux de couleur rouge, bleue et verte de votre nouvelle couleur.', shortcut: 'Aucun',
    imageLink: '/assets/Video/ChoixDeCouleurRapide.mp4' },
{ subjectTitle: 'Texte', description: 'Sélectionnez l\'outil Texte afin d\'écrire du texte à l\'écran. Il est possible de sélectionner ' +
    'l\'outil dans la barre d\'outils ou à l\'aide du raccourci \'T\'. ', shortcut: 'T', imageLink: '/assets/Video/text.mp4'},
];

export const FILES: Subject[] = [
{ subjectTitle: 'Envoi par courriel', description: 'Dans la boîte modale de l\'outil d\'exportation, cochez l\'option \'Envoyer par ' +
    'courriel\' afin d\'exporter le dessin à l\'adresse courriel voulue. Remplissez les champs qui apparaîtront sous la case à cocher ' +
    'après avoir coché cette dernière.', shortcut: 'Ctrl+E (pour l\'outil d\'exportation', imageLink: '/assets/Video/envoieCourriel.mp4'},
{ subjectTitle: 'Exporter le dessin', description: 'Le raccourci \'Ctrl+E\' permet d\'accéder rapidement à l\'interface d\'exportation. ' +
    'Définissez les paramètres et appuyez sur sauvegarder pour exporter le dessin.',
    shortcut: 'Ctrl+E', imageLink: '/assets/Video/exportation.mp4' },
{ subjectTitle: 'Filtrage par étiquette', description: 'Ouvrez le menu Galerie et recherchez le dessin souhaité en' +
    ' filtrant les étiquettes de la base de données avec la barre de recherche.', shortcut: 'Aucun' },
{ subjectTitle: 'Galerie de dessins', description: 'Il existe deux façons ' +
    'd\'accéder à la galerie de dessins: la première via la page de démarrage, la seconde ' +
    'en utilisant le raccourci \'Ctrl+G\'. Sélectionnez le dessin à charger et ' +
    'chargez l\'image dans la vue.', shortcut: 'Ctrl+G', imageLink: '/assets/Video/OuvertureGallerie.mp4' },
{ subjectTitle: 'Sauvegarder', description: 'Le raccourci \'Ctrl+S\' permet d\'accéder rapidement à l\'interface de sauvegarde. ' +
    'Choisissez le nom du dessin et ajouter des étiquettes qui permettent de faciliter la recherche. Cliquez sur sauvegarder pour ' +
    'enregistrer le dessin.', shortcut: 'Ctrl+S', imageLink: '/assets/Video/sauvegarde.mp4' },
];
