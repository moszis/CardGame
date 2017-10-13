SELECT ca.card_id, c.card_name, c.card_base_atk, c.card_base_hp, c.card_base_speed, c.card_image, pc.card_level,  GROUP_CONCAT(ability_id) as abilityList 
FROM cards c
JOIN player_cards pc
ON c.card_id = pc.card_id
JOIN card_abilities ca
ON c.card_id = ca.card_id
where ca.card_id in 
                 (Select distinct(pc.card_id) 
                 FROM player_cards pc
                 JOIN deck_cards dc
                 ON dc.player_card_rel_id = pc.player_card_rel_id
                 WHERE dc.deck_id = 1
)
GROUP BY c.card_id; 
