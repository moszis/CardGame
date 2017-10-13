import com.cardgame.dao.card_get;

import java.util.*;

public class TestMain {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        card_get getCard = new card_get();
        
        
        List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
        list = getCard.cardSelectAll();
        


        for (Map<String, Object> map : list){
            System.out.println("****");
             for (Map.Entry<String, Object> entry : map.entrySet()){
                 System.out.print("Key: "+entry.getKey()+"  ");
                 System.out.println("Value: "+entry.getValue());
             }
        }
    }
}
