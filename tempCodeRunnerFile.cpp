#include <iostream>
#include <vector>
#include <unordered_map>
#include <string>
#include <iostream>
#include <map>
#include <utility>
#include <array>
using namespace std;

int main() {
	int n;
	cin>>n;



    //matrix
    vector<vector<char>>d;
    for(int i=0; i<n; i++){ 
        vector<char> row;
        for(int j=0; j<n; j++){
            char temp;
            cin>>temp;
            row.push_back(temp);
        }
        d.push_back(row);
    }

    map< array<int, 2>, int> mapa;

    vector<int> answer;
 
    

    int i,j,count;
    for(int k=0;k<n; k++){
        for(int l=0; l<n; l++){
            count=0;
            if(d[k][l] == '1'){
                i=k; 
                j=l+1;
                if(j<0 || j>=n){}
                else
                    if(d[i][j]=='1'){
                        count++;
                    }
                i=k;
                j=l-1;
                if(j<0 || j>=n){}
                else
                    if(d[i][j]=='1'){
                        count++;
                    }
                j=l; 
                i=k+1;
                if(i<0 || i>=n){}
                else
                    if(d[i][j]=='1'){
                        count++;
                    }
                j=l;
                i=k-1;
                if(i<0 || i>=n){}
                else
                    if(d[i][j]=='1'){
                        count++;
                    }
            }
        array<int, 2> a = {k,l};
        mapa[a] = count;
        }
    }

    int zerocount = 0;
    int looptimes=0;



    while(zerocount!=n*n){
        looptimes++;
        int minn=INT_MAX;
        for(int k=0;k<n; k++){
            for(int l=0; l<n; l++){
                //cout <<"("<<k<<","<<l<<")"<<mapa[{k,l}] << " ";
                if(mapa[{k,l}]!=0)
                    minn=min(minn,mapa[{k,l}]);
            }
        }
        //cout<<endl;
        //cout << endl<<minn;

        int tempi,tempj,tempmap;

        tempmap=INT_MAX;
        int fn=0;
        for(int k=0;k<n; k++){
            for(int l=0; l<n; l++){
                if(mapa[{k,l}]==minn){
                    vector<int> tempii;
                    vector<int> tempjj;
                    vector<int> tempiii;
                    vector<int> tempjjj;
                    i=k; 
                    j=l+1;
                    if(j<0 || j>=n){}
                    else
                        if(d[i][j]=='1'){
                            if(mapa[{i,j}]<tempmap){
                                tempi=i;
                                tempj=j;
                                tempii.push_back(i);
                                tempjj.push_back(j);
                                tempmap=mapa[{i,j}];
                            }

                        }
                    i=k;
                    j=l-1;
                    if(j<0 || j>=n){}
                    else
                        if(d[i][j]=='1'){
                            if(mapa[{i,j}]<tempmap){
                                tempi=i;
                                tempj=j;
                                tempii.push_back(i);
                                tempjj.push_back(j);
                                tempmap=mapa[{i,j}];
                            }
                        }
                    j=l; 
                    i=k+1;
                    if(i<0 || i>=n){}
                    else
                        if(d[i][j]=='1'){
                            if(mapa[{i,j}]<tempmap){
                                tempi=i;
                                tempj=j;
                                tempii.push_back(i);
                                tempjj.push_back(j);
                                tempmap=mapa[{i,j}];
                            }
                        }
                    j=l;
                    i=k-1;
                    if(i<0 || i>=n){}
                    else
                        if(d[i][j]=='1'){
                            if(mapa[{i,j}]<tempmap){
                                tempi=i;
                                tempj=j;
                                tempii.push_back(i);
                                tempjj.push_back(j);
                                tempmap=mapa[{i,j}];
                            }
                        }
                    mapa[{tempi,tempj}] = 0;
                    mapa[{k,l}] = 0;
                    d[tempi][tempj] = '0';
                    d[k][l] = '0';
                    answer.push_back(tempi+1);
                    answer.push_back(tempj+1);
                    answer.push_back(k+1);
                    answer.push_back(l+1);
                    for(int i=0; i<tempii.size(); i++)
                        if(tempii[i]!=tempi)
                            mapa[{tempii[i],tempjj[i]}] -= 1;
                    

                    //
                    i=tempi; 
                    j=tempj+1;
                    if(j<0 || j>=n){}
                    else
                        if(d[i][j]=='1'){
                            if(mapa[{i,j}]<tempmap){
                                tempiii.push_back(i);
                                tempjjj.push_back(j);
                            }

                        }
                    i=tempi;
                    j=tempj-1;
                    if(j<0 || j>=n){}
                    else
                        if(d[i][j]=='1'){
                            if(mapa[{i,j}]<tempmap){
                                tempiii.push_back(i);
                                tempjjj.push_back(j);
                            }
                        }
                    j=tempj; 
                    i=tempi+1;
                    if(i<0 || i>=n){}
                    else
                        if(d[i][j]=='1'){
                            if(mapa[{i,j}]<tempmap){
                                tempiii.push_back(i);
                                tempjjj.push_back(j);
                            }
                        }
                    j=tempj;
                    i=tempi-1;
                    if(i<0 || i>=n){}
                    else
                        if(d[i][j]=='1'){
                            if(mapa[{i,j}]<tempmap){
                                tempiii.push_back(i);
                                tempjjj.push_back(j);
                            }
                        }

                    //
                    for(int i=0; i<tempiii.size(); i++)
                        mapa[{tempiii[i],tempjjj[i]}] -= 1;


                    fn=1;
                    break;
                }
            }
            if(fn==1)
                break;
        }
        zerocount=0;
        for(int k=0;k<n; k++){
            for(int l=0; l<n; l++){
                if(mapa[{k,l}]==0){
                    zerocount++;
                }
            }
        }
    }
   
    if(answer.size()==0)
        cout<<"0"<<endl;
    else{
        cout<<1<<endl;
        cout<<looptimes<<endl;
        for(int i= 0;i<(4*looptimes);i++){
            cout<<answer[i]<<" ";
            if((i+1)%4==0)
                cout<<endl;
        }
    }



return 0;
}