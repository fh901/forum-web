<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // -------------------------------------------------------
        // USERS
        // -------------------------------------------------------
        DB::table('users')->insert([
            [
                'id'         => 1,
                'nom'        => 'Admin Salon',
                'email'      => 'admin@salon.ma',
                'password'   => Hash::make('admin123'),
                'role'       => 'admin',
                'bio'        => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id'         => 6,
                'nom'        => 'M. Souhail Godari',
                'email'      => 'souhail@ensa.ma',
                'password'   => Hash::make('souhail123'),
                'role'       => 'conferencier',
                'bio'        => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id'         => 7,
                'nom'        => 'M. Nabil Ladib',
                'email'      => 'nabil@ensa.ma',
                'password'   => Hash::make('nabil123'),
                'role'       => 'conferencier',
                'bio'        => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id'         => 8,
                'nom'        => 'Fortinet',
                'email'      => 'fortinet@ensa.ma',
                'password'   => Hash::make('fortinet123'),
                'role'       => 'entreprise',
                'bio'        => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id'         => 9,
                'nom'        => 'Maryem EL HAOUD',
                'email'      => 'maryem@ensa.ma',
                'password'   => Hash::make('maryem123'),
                'role'       => 'etudiant',
                'bio'        => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id'         => 10,
                'nom'        => 'Fatima Ezzahraa Hsina',
                'email'      => 'fatima@ensa.ma',
                'password'   => Hash::make('fatima123'),
                'role'       => 'etudiant',
                'bio'        => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Sync auto_increment après insertion avec IDs manuels
        DB::statement('ALTER TABLE users AUTO_INCREMENT = 11');

        // -------------------------------------------------------
        // CONFERENCES
        // -------------------------------------------------------
        DB::table('conferences')->insert([
            [
                'id'               => 5,
                'titre'            => 'Collaboration, communication unifiée et architectures hybrides IA',
                'description'      => "Atelier abordant les nouvelles dynamiques de collaboration en entreprise, les solutions de communication unifiée et l'intégration de l'IA au sein d'architectures hybrides.",
                'date'             => '2025-11-12',
                'heure_debut'      => '10:00:00',
                'heure_fin'        => '15:00:00',
                'salle'            => 'Code 212',
                'speaker'          => 'M. Souhail Godari',
                'speaker_id'       => 6,
                'max_participants' => 60,
                'created_at'       => '2026-05-14 11:44:43',
                'updated_at'       => '2026-05-14 12:55:15',
            ],
            [
                'id'               => 6,
                'titre'            => "De l'innovation à la résilience - Cybersecurity Mesh",
                'description'      => "Atelier explorant le concept du Cybersecurity Mesh et son rôle stratégique dans le renforcement de la résilience des systèmes d'information.",
                'date'             => '2025-11-12',
                'heure_debut'      => '10:00:00',
                'heure_fin'        => '15:00:00',
                'salle'            => 'Code 212',
                'speaker'          => 'M. Nabil Ladib',
                'speaker_id'       => 7,
                'max_participants' => 60,
                'created_at'       => '2026-05-14 11:46:01',
                'updated_at'       => '2026-05-14 12:03:38',
            ],
        ]);

        DB::statement('ALTER TABLE conferences AUTO_INCREMENT = 7');

        // -------------------------------------------------------
        // STANDS
        // -------------------------------------------------------
        DB::table('stands')->insert([
            [
                'id'            => 1,
                'nom'           => 'Stand A1',
                'description'   => 'Espace 20m² — Entrée principale, grande visibilité',
                'disponible'    => 0,
                'entreprise'    => 'Fortinet',
                'entreprise_id' => 8,
                'created_at'    => '2026-05-04 22:07:58',
                'updated_at'    => '2026-05-14 12:02:48',
            ],
            [
                'id'            => 3,
                'nom'           => 'Stand C2',
                'description'   => '25m² avec électricité et connexion réseau — Idéal démos',
                'disponible'    => 1,
                'entreprise'    => null,
                'entreprise_id' => null,
                'created_at'    => '2026-05-04 22:07:58',
                'updated_at'    => '2026-05-04 22:07:58',
            ],
            [
                'id'            => 4,
                'nom'           => 'Stand D5',
                'description'   => '18m² — Coin tranquille, parfait pour entretiens et networking',
                'disponible'    => 1,
                'entreprise'    => null,
                'entreprise_id' => null,
                'created_at'    => '2026-05-04 22:07:58',
                'updated_at'    => '2026-05-04 22:07:58',
            ],
        ]);

        DB::statement('ALTER TABLE stands AUTO_INCREMENT = 6');

        // -------------------------------------------------------
        // INSCRIPTIONS
        // -------------------------------------------------------
        DB::table('inscriptions')->insert([
            // Maryem — inscrite aux 2 conférences
            [
                'id'            => 7,
                'user_id'       => 9,
                'conference_id' => 5,
                'created_at'    => '2026-05-14 12:05:12',
                'updated_at'    => '2026-05-14 12:05:12',
            ],
            [
                'id'            => 8,
                'user_id'       => 9,
                'conference_id' => 6,
                'created_at'    => '2026-05-14 12:05:13',
                'updated_at'    => '2026-05-14 12:05:13',
            ],
            // Fatima Ezzahraa — inscrite aux 2 conférences
            [
                'id'            => 9,
                'user_id'       => 10,
                'conference_id' => 5,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'id'            => 10,
                'user_id'       => 10,
                'conference_id' => 6,
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
        ]);

        DB::statement('ALTER TABLE inscriptions AUTO_INCREMENT = 11');

        // -------------------------------------------------------
        // PROGRAMMES
        // -------------------------------------------------------
        DB::table('programmes')->insert([
            [
                'id'          => 1,
                'titre'       => 'Programme de la journée de Forum Ensaj Entreprises',
                'contenu'     => "JOUR 1\n09:00 – 10:00 : Cérémonie d'ouverture du Forum\nMot des officiels\nSignature des conventions de partenariat\nRemise des prix de la compétition Innov'Boost\n10:00 – 10:30 : Inaugurations officielles\nInauguration des stands\nInauguration de l'Incubateur EMC2\nInauguration CODE 212\n10:30 – 11:00 : Pause café & Networking\n11:00 – 13:30 : Visite des stands & Networking\n13:30 – 14:30 : Déjeuner\n14:30 – 15:30 : Table ronde --Thème : Ingénierie Innovante : Nouveaux leviers pour la performance des entreprises\n15:30 – 16:30 : Table ronde --Thème : L'art de recruter et d'être recruté : clés pour une employabilité durable\n16:30 – 17:00 : Recrutement & Networking\nJOUR 2\n10:00 – 15:00 : Ateliers & Tables rondes -- Innovation, employabilité & entrepreneuriat\n15:00 – 15:30 : Clôture du Forum",
                'fichier_nom' => 'Forum_Planning.png',
                'fichier_path'=> 'programmes/nGWDsmx9xNHy34eVQKGQr94KpdBZvFAQh3sTpGl8.png',
                'fichier_type'=> 'image/png',
                'publie'      => 1,
                'created_at'  => '2026-05-04 22:07:58',
                'updated_at'  => '2026-05-14 11:30:42',
            ],
        ]);

        DB::statement('ALTER TABLE programmes AUTO_INCREMENT = 2');
    }
}