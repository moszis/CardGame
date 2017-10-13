package com.cardgame.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;

import java.util.*;


/**
 *
 * @author MOSzis
 */
public class card_get {
   
    private Connection connect = null;
    private Statement statement = null;
    //private PreparedStatement preparedStatement = null;
    private ResultSet resultSet = null;
    
    private String dbuser = "root";
    private String dbpass = "mosmos";
    
    public List<Map<String,Object>> cardSelectAll(){
        
        try{
            Class.forName("com.mysql.jdbc.Driver");
            connect = DriverManager.getConnection("jdbc:mysql://localhost/cardgame?user="+dbuser+"&password="+dbpass+"");
            
            statement = connect.createStatement();
            
            resultSet = statement.executeQuery("Select * from cardgame.cards");
            
            return convertResultSetToList(resultSet);
            
        }catch(Exception e){
            System.out.println("ERROR: "+e);
            return null;
     //     throw e;
            //need to output sql error here
        }finally{
            close();
        }
        
    }
  
    
    
    /*********************************************************************************
     *********************GENERIC UTIL METHODS****************************************/
    
    
    public List<Map<String,Object>> convertResultSetToList(ResultSet rs) throws SQLException {
        ResultSetMetaData md = rs.getMetaData();
        int columns = md.getColumnCount();
        List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();

        while (rs.next()) {
            HashMap<String,Object> row = new HashMap<String, Object>(columns);
            for(int i=1; i<=columns; ++i) {
                row.put(md.getColumnName(i),rs.getObject(i));
            }
            list.add(row);
        }

        return list;
    }


    //Need to modify to add try catch for each and null checks.
    private void close(){
      try{
        resultSet.close();
        statement.close();
        connect.close();
      }catch(SQLException e){}
    }
    
}
