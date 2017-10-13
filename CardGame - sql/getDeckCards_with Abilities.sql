SELECT c.card_id, c.card_name, c.card_base_atk, c.card_base_hp, c.card_base_speed, c.card_image, pc.card_level, GROUP_CONCAT(distinct(ca.ability_id)) as abilityList
                 FROM cards c 
                 JOIN player_cards pc
                 ON c.card_id = pc.card_id
				 JOIN card_abilities ca
				 ON ca.card_id = c.card_id
                 JOIN deck_cards dc
                 ON dc.player_card_rel_id = pc.player_card_rel_id
                 WHERE dc.deck_id = 1